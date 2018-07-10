#!/usr/bin/env node
const log = require("npmlog");
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { deleteFolder, grabSelectedlibraries, executeCommand } = require('./libraries');
const { buildLibrary } = require('./libraries');

async function executeNPMLinkForLibrary(library) {
  executeCommand('npm', ['link'], library.distPath);
}

async function main() {
  log.info('setup command', `execute setup command`);

  executeCommand('npm', ['install']);

  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    deleteFolder(library.distPath);
  }

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    executeCommand('npm', ['install'], library.sourcePath);
    await buildLibrary(library);
    await executeNPMLinkForLibrary(library);
  }
}

(async function() {
  await main();
}());

