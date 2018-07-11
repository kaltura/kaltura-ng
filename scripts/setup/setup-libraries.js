const log = require("npmlog");
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { libraries, buildLibrary } = require('../libraries');
const { deleteFolder, executeCommand } = require('../lib/fs');

async function executeNPMLinkForLibrary(library) {
  executeCommand('npm', ['link'], { cwd: library.distPath });
}

async function setupLibraries() {
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

module.exports = { setupLibraries }
