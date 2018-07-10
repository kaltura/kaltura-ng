const log = require("npmlog");
const { executeCommand, readJsonFile, writeJsonFile } = require('./lib/fs');
const { getCurrentBranch, hasUnCommittedChanges, hasTags } = require('./lib/git');
const makeDiffPredicate = require("./publish/make-diff-predicate");
const collectDependents = require("./publish/collect-dependents");
const { argv, libraries, buildLibraries } = require('./definitions');
const { getVersionsForUpdates } = require('./publish/conventional-commits');
const { updateLibrariesAssets } = require('./publish/update-libraries-assets');
const { publishLibrariesToNpm } = require('./publish/publish-libraries-to-npm');
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

//log.level = 'verbose';

function collectUpdates() {

  if (!hasTags())
  {
    log.error('ENOTAGS','no tags found, this script does not support new repositories');
    process.exit(1);
  }

  const committish = executeCommand("git", ["describe", "--abbrev=0"]);
  log.verbose("collect updates", `comparing changes between head and commit ${committish}`);
  const candidates = new Set();
  const hasDiff = makeDiffPredicate(committish, execOpts, options.ignoreChanges);

  libraries.forEach(library => {
    if(hasDiff({ location: library.sourcePath})) {
      candidates.add(library);
    }
  });

  log.info(`collect updates`, `found ${candidates.size} libraries to publish`);
  log.verbose('collect updates', Array.from(candidates.values()).map(library => library.name).join(', '));

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

  log.info(`collect updates`, `found ${updates.size} libraries including dependents to publish`);
  log.verbose('collect updates', Array.from(updates.values()).map(library => library.name).join(', '));

  return updates;
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
    log.error('Specified branch is different from active. Please checkout to specified branch or provide relevant branch name.');
    log.error(`Specified branch: ${options.branch}. Active branch: ${currentBranch}`);
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

  log.info('prepare', `rebuild all libraries (not only those who were updated)`);
  await buildLibraries(libraries);

  log.info('prepare', `get new versions for libraries`);
  for(let i = 0; i<updatedLibraries.length; i++) {
    const library = updatedLibraries[i];
    const newVersion = await getVersionsForUpdates(library);
    updates.set(library.name, { newVersion, library});
  }

  return updates;
}

async function main() {

  const updates = await prepare();

  // TODO prompt Are you sure you want to publish the above changes?
  log.warn('prompt', 'Are you sure you want to publish the above changes?');
  //updates.forEach(update => log.info(update.library.name, update.newVersion));

  log.info('execute', `update libraries assets`);
  await updateLibrariesAssets(updates);

  log.info('execute', `git commit and tag libraries`);
  await commitAndTagUpdates(updates);

  log.info('execute', `publish libraries to npmjs`);
  await publishLibrariesToNpm(updates);

  log.info('execute', `push updates to git`);
  log.info('done');
}

(async function() {
  await main();
}());


