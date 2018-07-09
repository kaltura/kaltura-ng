const log = require("npmlog");
const { executeCommand } = require('./lib/utils');
const { getCurrentBranch, hasUnCommittedChanges, hasTags } = require('./lib/git');
const conventionalRecommendedBump = require('conventional-recommended-bump');
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

function getVersionsForUpdates(library) {
  return new Promise((resolve, reject) => {
    conventionalRecommendedBump(
      {
        tagPrefix: `${library.name}@`,
        path: library.sourcePath,
        preset: 'angular'
      },
      (err, release) => {
        if (err) {
          return reject(err);
        } else {
          log.verbose('get version', `increment ${library.name} by level ${release.releaseType} (${release.reason})`);
          resolve(release);
        }
      }
    );
  });
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

  const updates = collectUpdates();

  if (updates.size === 0) {
    log.info("No updated packages to publish");
    // still exits zero, aka "ok"
    process.exit(0);
    return;
  }

  for(let i = 0; i<updates.length; i++) {
    const library = updates[i];
    const nextVersion = await getVersionsForUpdates(library);
  }

  log.info('done');
}

(async function() {
  await main();
}());


