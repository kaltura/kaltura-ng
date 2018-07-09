#!/usr/bin/env node
const { buildLibrary } = require('./lib/build-library');
const { grabSelectedlibraries } = require('./definitions');

async function main() {
  console.log(`execute build command`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    await buildLibrary(library);
  }
}

(async function() {
  await main();
}());

