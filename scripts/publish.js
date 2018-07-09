const log = require("npmlog");
const { executeCommand, readJsonFile, writeJsonFile } = require('./lib/fs');
const { getCurrentBranch, hasUnCommittedChanges, hasTags } = require('./lib/git');
const makeDiffPredicate = require("./publish/make-diff-predicate");
const collectDependents = require("./publish/collect-dependents");
const { argv, libraries } = require('./definitions');
const { getVersionsForUpdates } = require('./publish/conventional-commits');
const { updateLibraries } = require('./publish/update-changelog');
const { commitAndTagUpdates } = require('./publish/commit-and-tag-updates');
const path = require('path');

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
  });

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

async function prepare() {

  const updates = new Map([]);

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

  const updatedLibraries = collectUpdates();

  if (updatedLibraries.size === 0) {
    log.info("No updated packages to publish");
    // still exits zero, aka "ok"
    process.exit(0);
    return;
  }

  for(let i = 0; i<updatedLibraries.length; i++) {
    const library = updatedLibraries[i];
    const newVersion = await getVersionsForUpdates(library);
    updates.set(library.name, { newVersion, library});
  }

  return updates;
}

async function main() {

  const updates= await prepare();

  // TODO prompt Are you sure you want to publish the above changes?
  log.warn('prompt', 'Are you sure you want to publish the above changes?');
  //updates.forEach(update => log.info(update.library.name, update.newVersion));

  await updateLibraries(updates);

  await commitAndTagUpdates(updates);

  //await publishToNpm();

  // push to git
  log.info('done');
}

(async function() {
  await main();
}());


