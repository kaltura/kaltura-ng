#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { deleteFolder, grabSelectedlibraries, executeCommand } = require('./lib/utils');
const { buildLibrary } = require('./lib/build-library');

async function executeNPMLinkForLibrary(library) {
  await executeCommand('npm', ['link'], library.distPath);
}

async function main() {
  console.log(`execute setup command`);

  await executeCommand('npm', ['install']);

  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    deleteFolder(library.distPath);
  }

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    await executeCommand('npm', ['install'], library.sourcePath);
    await buildLibrary(library);
    await executeNPMLinkForLibrary(library);
  }
}

(async function() {
  await main();
}());

