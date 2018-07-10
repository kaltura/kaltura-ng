#!/usr/bin/env node
const log = require("npmlog");
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { grabSelectedlibraries, buildLibrary } = require('./libraries');
const { deleteFolder, executeCommand } = require('./lib/fs');

async function executeNPMLinkForLibrary(library) {
  executeCommand('npm', ['link'], { cwd: library.distPath });
}

async function main() {
  log.info('setup command', `execute command`);

  log.info('repository', 'install repository dependencies');
  executeCommand('npm', ['install']);

  const libraries = grabSelectedlibraries();

  for (let it = libraries.values(), library= null; library=it.next().value; ) {
    log.info(library.name, 'delete library dist folder');
    deleteFolder(library.distPath);
  }

  for (let it = libraries.values(), library= null; library=it.next().value; ) {
    log.info(library.name, 'install library dependencies');
    executeCommand('npm', ['install'], {cwd: library.sourcePath});
    log.info(library.name, 'build library');
    await buildLibrary(library);
    log.info(library.name, 'npm link library');
    await executeNPMLinkForLibrary(library);
  }
}

(async function() {
  await main();
}());

