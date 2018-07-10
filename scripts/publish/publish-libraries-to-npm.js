const log = require("npmlog");
const { argv, buildLibraries } = require('../definitions');
const { npmPublishLibrary } = require('../lib/npm');
const os = require('os');

async function publishLibrariesToNpm(updates) {
  log.info("publish", "Publishing packages to npm...");

  let chain = Promise.resolve();

  const libraries = Array.from(updates.values()).reduce((result, {library}) => {result.add(library); return result;},new Set());
  chain = chain.then(() => buildLibraries(libraries));
  chain = chain.then(() => npmPublishLibraries(libraries));

  return chain.then(() => {
    const message = Array.from(libraries.values()).map(library => ` - ${library.pkg.name}@${library.pkg.version}`);

    log.info("Successfully published to npmjs", `${message.join(os.EOL)}`);
  });
}

function npmPublishLibraries(libraries) {

  const tracker = log.newItem("npmPublish");
  tracker.addWork(libraries.length);

  let chain = Promise.resolve();

  libraries.forEach(library => {
    chain.then(() => {
      tracker.verbose("publishing", library.pkg.name);
      npmPublishLibrary(library.name, library.distPath);
      tracker.info("published", library.pkg.name);
      tracker.completeWork(1);
    });
  });

  return chain;
}

module.exports = { publishLibrariesToNpm };
