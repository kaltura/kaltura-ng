const log = require("npmlog");
const { npmPublishLibrary } = require('../lib/npm');
const os = require('os');

async function publishLibrariesToNpm(libraries) {
  log.info("publish", "publishing libraries to npmJS");

  let chain = Promise.resolve();
  chain = chain.then(() => npmPublishLibraries(libraries));

  return chain.then(() => {
    Array.from(libraries.values()).forEach(library => {
      log.info('publish', `published ${library.pkg.name}@${library.pkg.version} to npmJS`);
    });
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
      tracker.verbose("published", library.pkg.name);
      tracker.completeWork(1);
    });
  });

  return chain;
}

module.exports = { publishLibrariesToNpm };
