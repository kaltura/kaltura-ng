#!/usr/bin/env node
const log = require("npmlog");
const { grabSelectedlibraries, buildLibraries } = require('./definitions');

async function main() {
  log.info('build command', `execute build command`);
  const libraries = grabSelectedlibraries();

  await buildLibraries(libraries);
}

(async function() {
  await main();
}());

