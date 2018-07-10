const log = require("npmlog");
const { executeCommand, readFile, writeFile, deleteFile, isExists } = require('./lib/fs');
const { getCurrentBranch, hasUnCommittedChanges, gitPush, hasTags } = require('./lib/git');
const makeDiffPredicate = require("./publish/make-diff-predicate");
const collectDependents = require("./publish/collect-dependents");
const { argv, libraries, buildLibraries } = require('./libraries');
const { getVersionsForUpdates } = require('./publish/conventional-commits');
const { updateLibrariesAssets } = require('./publish/update-libraries-assets');
const { publishLibrariesToNpm } = require('./publish/publish-libraries-to-npm');
const { commitAndTagUpdates } = require('./publish/commit-and-tag-updates');
const path = require('path');
const inquirer = require('inquirer');
const semver = require("semver");

const INIT_STATUS = 'INIT_STATUS';
const PREPARING_STATUS = 'PREPARING_STATUS';
const PREPARED_STATUS = 'PREPARED_STATUS';
const EXECUTING_STATUS = 'EXECUTING_STATUS';
const ERROR_STATUS = 'ERROR_STATUS';

const CONTINUE_MODE = 'CONTINUE_MODE';
const ABORT_MODE = 'ABORT_MODE';
const START_MODE = 'START_MODE';
const CI_MODE = 'CI_MODE';


if (argv['verbose']) {
  log.level = 'verbose';
}

const options = {
  branch: argv['branch'] || 'master',
  forceBumpTo: argv['forceBumpTo'],
  publishStatusPath: path.resolve(__dirname, '.publish-status'),
  skipBuild: !!argv['skipBuild'] || false,
  mode: !!argv['continue'] ? CONTINUE_MODE :
    !!argv['abort'] ? ABORT_MODE :
    !!argv['ci'] ? CI_MODE :
      START_MODE,
  "ignoreChanges": [
    "ignored-file",
    "*.md"
  ]
};

log.verbose('options', '', options);

function getInteractiveStatus() {
  const result = isExists(options.publishStatusPath) ? readFile(options.publishStatusPath) : INIT_STATUS;
  log.verbose('getInteractiveStatus', result);
  return result;
}

function completeInteractivePublish() {
  log.verbose('completeInteractivePublish', 'complete publish process');
  if (isExists(options.publishStatusPath)) {
    deleteFile(options.publishStatusPath);
  }
}

function setNewInteractiveStatus(newStatus) {
  if ([PREPARING_STATUS, PREPARED_STATUS, EXECUTING_STATUS, ERROR_STATUS].indexOf(newStatus) === -1) {
    log.error('EINTERACTIVE', `provided status is not supported '${newStatus}'`);
  }
  log.verbose('setNewInteractiveStatus', `from ${getInteractiveStatus()} to ${newStatus}`);
  writeFile(options.publishStatusPath, newStatus);
}

function validateOptions() {
  if (options.forceBumpTo) {
    if ((['major','minor'].indexOf(options.forceBumpTo)) === -1) {
      log.error('EOPTIONS', `expected 'options.forceBumpTo' to be '' (default), 'major' or 'minor', got '${options.forceBumpTo}'`);
      process.exit(1);
    }
  }

  const currentInteractiveStatus = getInteractiveStatus();
  if ((options.mode === START_MODE || options.mode === CI_MODE && currentInteractiveStatus !== INIT_STATUS) {
    log.error('EOPTIONS', `An active publish process was detected, should either '--continue' or '--abort' process`);
    process.exit(1);
  } else if (options.mode === CONTINUE_MODE && currentInteractiveStatus === INIT_STATUS) {
    log.error('EOPTIONS', `No active publish process found, nothing to continue`);
    process.exit(1);
  } else if (options.mode === CONTINUE_MODE && currentInteractiveStatus === ERROR_STATUS) {
    log.error('EOPTIONS', `An error happend as part of active publish process, please '--abort' process`);
    process.exit(1);
  }

  if (options.skipBuild) {
    log.error('EOPTIONS', `option 'skipBuild' should not be in use, please abort and execute without this option`);
  }
}
function collectUpdates() {

  if (!hasTags())
  {
    log.error('ENOTAGS','no tags found, this script does not support new repositories');
    process.exit(1);
  }

  const committish = executeCommand("git", ["describe", "--abbrev=0"]);
  log.verbose("collect updates", `comparing changes between head and commit ${committish}`);
  const candidates = new Set();
  const hasDiff = makeDiffPredicate(committish, {
    cwd: process.cwd()
  }, options.ignoreChanges);

  libraries.forEach(library => {
    if(hasDiff({ location: library.sourcePath})) {
      candidates.add(library);
    }
  });

  log.verbose(`collect updates`, `found ${candidates.size} libraries to publish`, Array.from(candidates.values()).map(library => library.name).join(', '));

  const dependents = collectDependents(candidates);
  dependents.forEach(node => candidates.add(node));

  // The result should always be in the same order as the input
   const updates = new Set();

  libraries.forEach((library) => {
    if (candidates.has(library)) {
      log.verbose("updated", library.name);

      updates.add(library);
    }
  });

  log.info(`collect updates`, `found ${updates.size} libraries to publish`);
  log.verbose('collect updates', Array.from(updates.values()).map(library => library.name).join(', '));

  return updates;
}

function confirm(message) {
  log.pause();

  return inquirer
    .prompt([
      {
        type: "expand",
        name: "confirm",
        message,
        default: 2, // default to help in order to avoid clicking straight through
        choices: [{ key: "y", name: "Yes", value: true }, { key: "n", name: "No", value: false }],
      },
    ])
    .then(answers => {
      log.resume();

      return answers.confirm;
    });
}

async function prepare() {

  const updates = new Map([]);
  const currentBranch = getCurrentBranch();

  log.info('prepare', `verify current branch is not detached`, { currentBranch});
  if (currentBranch === "HEAD") {
    throw new Error("Detached git HEAD, please checkout a branch to publish changes.");
  }

  log.info('prepare', `verify current branch is accepted`, { currentBranch, acceptedBranch: options.branch});
  if (options.branch !== currentBranch) {
    log.error('EBRANCH','Specified branch is different from current. Please checkout to specified branch or provide relevant branch name.');
    process.exit(1);
  }

  // TODO uncomment this
  log.info('prepare', `verify everything is commited`);
  // if (hasUnCommittedChanges()) {
  //   log.error('It seems that you have uncommitted changes. To perform this command you should either commit your changes or reset them. Abort.')
  //   process.exit(1);
  // }

  // TODO check `isBehindUpstream`
  //log.info('prepare', `verify branch is not behind upstream`);

  log.info('prepare', `find libraries with updates`);
  const updatedLibraries = collectUpdates();

  if (updatedLibraries.size === 0) {
    log.info("Not found libraries to publish");
    // still exits zero, aka "ok"
    process.exit(0);
    return;
  }

  if (!options.skipBuild) {
    log.info('prepare', `rebuild all libraries (not only those who were updated)`);
    await buildLibraries(libraries);
  }

  log.info('prepare', `find next versions`, { forceBumpTo: options.forceBumpTo || '(default)'});
  for (let it = updatedLibraries.values(), library= null; library=it.next().value; ) {
    let newVersion = null;
    if (options.forceBumpTo) {
      newVersion = semver.inc(library.pkg.version, options.forceBumpTo);
    }else {
      newVersion = await getVersionsForUpdates(library);
    }
    updates.set(library.name, { newVersion, library});
  }

  updates.forEach(({library, newVersion }) => {
    log.info('prepare', `update ${library.name} from ${library.pkg.version} to ${newVersion}`);
  });

  if (updates )

  return (await confirm("Are you sure you want to publish the above changes?"))  ? updates : null;
}

async function execute(updates) {
  log.info('publish command', `execute command`);

  log.info('execute', `update libraries assets`);
  await updateLibrariesAssets(updates);

  log.info('execute', `git commit and tag libraries`);
  await commitAndTagUpdates(updates);

  log.info('execute', `publish libraries to npmjs`);
  await publishLibrariesToNpm(updates);

  log.info('execute', `push updates to git`);
  const currentBranch = getCurrentBranch();

  gitPush('origin', currentBranch);
}

async function main() {

  log.info('main', 'validate options');
  validateOptions();

  try {
    if (options.mode === ABORT_MODE) {
      log.info('main', `aborting process`);
      completeInteractivePublish();
      log.info('main', `process aborted, please review your branch`);
      process.exit(0);
    }

    const lastInteractiveStatus = getInteractiveStatus();

    if (lastInteractiveStatus === INIT_STATUS) {
      setNewInteractiveStatus(PREPARING_STATUS);
      const updates = await prepare();

      if (!updates || updates.size === 0) {
        log.info('main', 'no libraries selected to publish, action aborted');
        completeInteractivePublish();
        process.exit(0);
      }

      setNewInteractiveStatus(PREPARED_STATUS);
      log.info('main', 'please review changes in libraries and then continue the publish process');
      process.exit(0);
    }

    if (lastInteractiveStatus === PREPARED_STATUS) {
      setNewInteractiveStatus(EXECUTING_STATUS);
      await execute(updates);
      completeInteractivePublish();
    }
  }catch(err) {
    try {
      log.error('EGENERAL', err);
      setNewInteractiveStatus(ERROR_STATUS);
    } catch(updateErr) {
      log.error(updateErr);
    }
  }
}

(async function() {
  await main();
}());


