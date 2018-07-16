#!/usr/bin/env node
const log = require("npmlog");
const { grabSelectedlibraries, buildLibraries } = require('./libraries');
const { options } = require('./build/definitions');

async function main() {
  log.info('build command', `execute command`, options );
  const libraries = grabSelectedlibraries(options.specificLibrary);

  await buildLibraries(libraries);
}

(async function() {
  await main();
}());

