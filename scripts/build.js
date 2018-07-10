#!/usr/bin/env node
const log = require("npmlog");
const { grabSelectedlibraries, buildLibraries } = require('./libraries');

async function main() {
  log.info('build command', `execute command`);
  const libraries = grabSelectedlibraries();

  await buildLibraries(libraries);
}

(async function() {
  await main();
}());

