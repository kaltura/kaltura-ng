const log = require("npmlog");
const { executeCommand } = require('./lib/utils');
const { getCurrentBranch, hasUnCommittedChanges, hasTags } = require('./lib/git');
const makeDiffPredicate = require("./lib/lerna/make-diff-predicate");
const collectDependents = require("./lib/lerna/collect-dependents");
const { argv, libraries } = require('./definitions');

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
  log.warn('dependent', '',dependents.size + ' ' +  candidates.size);
  // dependents.forEach(node => candidates.add(node));
  //
  // // The result should always be in the same order as the input
  // const updates = [];
  //
  // packages.forEach((node, name) => {
  //   if (candidates.has(node)) {
  //     logger.verbose("updated", name);
  //
  //     updates.push(node);
  //   }
  // });

  //return updates;

  //log.info('hasDiff', test);
}

async function main() {
  console.log(`execute publish command`);

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

  collectUpdates();

  log.info('done');
}

(async function() {
  await main();
}());


