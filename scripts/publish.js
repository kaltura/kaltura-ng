const log = require("npmlog");
const { executeCommand } = require('./lib/fs');
const { getCurrentBranch, hasUnCommittedChanges, gitPush, hasTags } = require('./lib/git');
const makeDiffPredicate = require("./publish/make-diff-predicate");
const collectDependents = require("./publish/collect-dependents");
const { repositoryLibraries } = require('./libraries');
const { getVersionsForUpdates } = require('./publish/conventional-commits');
const { updateLibrariesAssets } = require('./publish/update-libraries-assets');
const { publishLibrariesToNpm } = require('./publish/publish-libraries-to-npm');
const { commitAndTagUpdates } = require('./publish/commit-and-tag-updates');
const inquirer = require('inquirer');
const semver = require("semver");
const { options, ABORT_MODE, CI_MODE, START_MODE, CONTINUE_MODE} = require('./publish/definitions');
const { INIT_STATUS,
  PREPARING_STATUS,
  PREPARED_STATUS,
  EXECUTING_STATUS,
  ERROR_STATUS,
  getInteractiveStatus,
  resetInteractivePublish,
  setNewInteractiveStatus
} = require('./publish/interactive');
const { setupLibraries } = require('./setup/setup-libraries');

function getLibrariesToPublish() {

  if (!hasTags())
  {
    log.error('ENOTAGS','no tags found, this script does not support new repositories');
    process.exit(1);
  }

  const committish = executeCommand("git", ["describe", "--abbrev=0"]);
  log.verbose("getLibrariesToPublish", `comparing changes between head and commit ${committish}`);
  const candidates = new Set();
  const hasDiff = makeDiffPredicate(committish, {
    cwd: process.cwd()
  }, options.ignoreChanges);

  repositoryLibraries.forEach(library => {
    if(hasDiff({ location: library.sourcePath})) {
      candidates.add(library);
    }
  });

  log.verbose(`getLibrariesToPublish`, `found ${candidates.size} libraries to publish`, Array.from(candidates.values()).map(library => library.name).join(', '));

  const dependents = collectDependents(candidates);
  dependents.forEach(node => candidates.add(node));

  // The result should always be in the same order as the input
   const updates = new Set();

  repositoryLibraries.forEach((library) => {
    if (candidates.has(library)) {
      log.verbose("getLibrariesToPublish", `library updated ${library.name}`);

      updates.add(library);
    }
  });

  log.info(`getLibrariesToPublish`, `found ${updates.size} libraries to publish`);
  log.verbose('getLibrariesToPublish', Array.from(updates.values()).map(library => library.name).join(', '));

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

function prePrepare() {
  const currentBranch = getCurrentBranch();
  log.info('prePrepare', `verify current branch is not detached`, {currentBranch});
  if (currentBranch === "HEAD") {
    throw new Error("Detached git HEAD, please checkout a branch to publish changes.");
  }

  if (options.diagnostic) {
    log.warn('prePrepare', `'hasUnCommittedChanges' check skipped (diagnostic mode)`);
  } else {
    log.info('prePrepare', `verify everything is commited`);
    if (hasUnCommittedChanges()) {
      log.error('it seems that you have uncommitted changes. To perform this command you should either commit your changes or reset them. Abort.')
      process.exit(1);
  }}

  // TODO check `isBehindUpstream`
  //log.info('prepare', `verify branch is not behind upstream`);
}

async function prepare() {

  const updates = new Map();
  const libraries = getLibrariesToPublish();

  if (libraries.size === 0) {
    log.info("did not found any libraries to publish");
    resetInteractivePublish();
    // still exits zero, aka "ok"
    process.exit(0);
    return;
  }

  if (options.diagnostic) {
    log.warn('prepare', `'setupLibraries' skipped (diagnostic mode)`);
  } else {
      log.info('prepare', `setup environment`);
      await await setupLibraries()
  }

  log.info('prepare', `find next versions`, { forceBumpTo: options.forceBumpTo || '(default)'});
  for (let it = libraries.values(), library= null; library=it.next().value; ) {
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

  const userConfirmed = await confirm("Are you sure you want to publish the above changes?");

  if (userConfirmed) {
    log.info('main', `update libraries assets`);
    await updateLibrariesAssets(updates);
  }

  return userConfirmed;

}

async function execute() {

  const libraries = getLibrariesToPublish();

  if (libraries.size === 0) {
    log.error("EEXECUTE", "Cannot find libraries to update");
    process.exit(1);
    return;
  }

  log.info("execute", "setup repository libraries to include publish changes");
  await setupLibraries();

  if (options.diagnostic) {
    log.warn('execute', `'commitAndTagUpdates' skipped (diagnostic mode)`);
  } else {
    log.info('execute', `git commit and tag libraries`);
    await commitAndTagUpdates(libraries);
  }

  if (options.diagnostic) {
    log.warn('execute', `'publishLibrariesToNpm' skipped (diagnostic mode)`);
  } else {
    log.info('execute', `publish libraries to npmjs`);
    await publishLibrariesToNpm(libraries);
  }

  if (options.diagnostic) {
    log.warn('execute', `'gitPush' skipped (diagnostic mode)`);
  } else {
    log.info('execute', `push updates to git`);
    const currentBranch = getCurrentBranch();
    gitPush('origin', currentBranch);
  }
}

function validateOptions() {
  if (options.mode === CI_MODE) {
    log.error('EOPTIONS', `ci mode is not supported yet by design, will be added if needed`);
    process.exit(1);
  }

  const currentInteractiveStatus = getInteractiveStatus();
  if ((options.mode === START_MODE || options.mode === CI_MODE) && currentInteractiveStatus !== INIT_STATUS) {
    log.error('EOPTIONS', `An active publish process was detected, should either '--continue' or '--abort' process`);
    process.exit(1);
  } else if (options.mode === CONTINUE_MODE && currentInteractiveStatus === INIT_STATUS) {
    log.error('EOPTIONS', `No active publish process found, nothing to continue`);
    process.exit(1);
  }  else if (options.mode === ABORT_MODE && currentInteractiveStatus === INIT_STATUS) {
    log.error('EOPTIONS', `No active publish process found, nothing to abort`);
    process.exit(1);
  } else if (options.mode === CONTINUE_MODE && currentInteractiveStatus !== PREPARED_STATUS) {
    log.error('EOPTIONS', `An active publish process stopped unexpectedly and cannot be recovered, please '--abort' process`);
    process.exit(1);
  }

}

async function main() {
  log.info('main', 'validate options');
  validateOptions();

  const currentBranch = getCurrentBranch();
  log.info('prepare', `verify current branch is accepted`, { currentBranch, acceptedBranch: options.branch});
  if (options.branch !== currentBranch) {
    log.error('EBRANCH','Specified branch is different from current. Please checkout to specified branch or provide relevant branch name.');
    process.exit(1);
  }

  try {
    if (options.mode === ABORT_MODE) {
      log.info('main', `aborting process`);
      resetInteractivePublish();
      log.info('main', `publish process aborted`);
      log.info('main', `NOTE: you should revert uncommited changes in the branch`);
      process.exit(0);
    }

    const lastInteractiveStatus = getInteractiveStatus();

    if (lastInteractiveStatus === INIT_STATUS) {
      log.info('main', 'execute pre prepare verifications');
      prePrepare();

      setNewInteractiveStatus(PREPARING_STATUS);
      const status = await prepare();

      if (!status) {
        log.info('main', 'no libraries selected to publish, action aborted');
        resetInteractivePublish();
      } else {
        setNewInteractiveStatus(PREPARED_STATUS);
        log.info('main', `please review changes in libraries and then --continue the publish process`);
        log.info('main', 'NOTE: you should not commit anything, it will be done by the publish process once you continue');
      }

      process.exit(0);
    }

    if (lastInteractiveStatus === PREPARED_STATUS) {
      setNewInteractiveStatus(EXECUTING_STATUS);
      await execute();
      resetInteractivePublish();
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


