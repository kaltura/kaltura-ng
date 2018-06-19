#!/usr/bin/env node
const { buildLibrary } = require('./lib/build-library');
const { grabSelectedlibraries } = require('./lib/utils');

async function main() {
  console.log(`build libraries`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    await buildLibrary(library);
  }
}

(async function() {
  await main();
}());

