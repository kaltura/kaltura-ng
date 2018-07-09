const log = require("npmlog");
const { executeCommand } = require('./lib/utils');
const { getCurrentBranch, hasUnCommittedChanges, hasTags } = require('./lib/git');
const makeDiffPredicate = require("./lib/lerna/make-diff-predicate");
const collectDependents = require("./lib/lerna/collect-dependents");
const { argv, libraries } = require('./definitions');
const { getVersionsForUpdates } = require('./lib/conventional-commits');

// TODO get options
const options = {
  branch: 'devop',
  "ignoreChanges": [
    "ignored-file",
    "*.md"
  ]
};

const execOpts = {
  cwd: process.cwd()
};

log.level = 'verbose';

function collectUpdates() {
  if (!hasTags())
  {
    log.error('ENOTAGS','this script does not support new branches');
    process.exit(1);
  }

  const committish = executeCommand("git", ["describe", "--abbrev=0"]);
  log.info("", `Comparing with ${committish}`);
  const candidates = new Set();
  const hasDiff = makeDiffPredicate(committish, execOpts, options.ignoreChanges);

  libraries.forEach(library => {
    if(hasDiff({ location: library.sourcePath})) {
      candidates.add(library);
    }
  })

  const dependents = collectDependents(candidates);
  dependents.forEach(node => candidates.add(node));

  // The result should always be in the same order as the input
   const updates = [];

  libraries.forEach((library) => {
    if (candidates.has(library)) {
      log.verbose("updated", library.name);

      updates.push(library);
    }
  });

  return updates;
}

const updatedLibraries = new Map([]);

async function prepare() {

  // const pkg = loadJsonFile.sync(findUp.sync('package.json', { cwd: process.cwd() }));
  // const version = pkg.version;
  const currentBranch = getCurrentBranch();

  if (currentBranch === "HEAD") {
    throw new Error("Detached git HEAD, please checkout a branch to publish changes.");
  }

  if (options.branch !== currentBranch) {
    log.error('Specified branch is different from active. Please checkout to specified branch or provide relevant branch name.');
    log.error(`Specified branch: ${options.branch}. Active branch: ${currentBranch}`);
    process.exit(1);
  }

  // TODO uncomment this
  // if (hasUnCommittedChanges()) {
  //   log.error('It seems that you have uncommitted changes. To perform this command you should either commit your changes or reset them. Abort.')
  //   process.exit(1);
  // }

  // TODO check `isBehindUpstream`

  const updates = collectUpdates();

  if (updates.size === 0) {
    log.info("No updated packages to publish");
    // still exits zero, aka "ok"
    process.exit(0);
    return;
  }

  for(let i = 0; i<updates.length; i++) {
    const library = updates[i];
    const newVersion = await getVersionsForUpdates(library);
    updatedLibraries.set(library.name, { newVersion, library});
  }
}

async function updateLibraries() {
  updatedLibraries.forEach(({ library, newVersion }) => {
    ['package.json', 'package-lock.json'].forEach(pkgFileName => {
      log.verbose(config, `update version to ${newVersion}`);
      const configPath = path.resolve(library.sourcePath, pkgFileName);
      const configFile = loadJsonFile.sync(configPath);
      configFile.version = newVersion;
      // TODO learn indentation from file
      writeJsonFile.sync(configPath, configFile, {indent: 2});
    });

  });


  // TODO update package json files

  // TOOD update changelogs
}

async function main() {

  await prepare();

  // TODO prompt Are you sure you want to publish the above changes?
  updatedLibraries.forEach(update => log.info(update.library.name, update.newVersion));

  await updateLibraries();

  // push to git
  log.info('done');
}

(async function() {
  await main();
}());


