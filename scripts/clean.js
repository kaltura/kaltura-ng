#!/usr/bin/env node
const log = require("npmlog");
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { deleteFolder, grabSelectedlibraries } = require('./libraries');

async function main() {
  log.info('clean command', `execute clean command`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    const nodeModulesPath = path.resolve(library.sourcePath,"node_modules");

    log.info('', `delete 'node_modules' folder of library '${library.name}'`);
    deleteFolder(nodeModulesPath);

    log.info('', `delete dist folder of library '${library.name}'`);
    deleteFolder(library.distPath);
  }
}

(async function() {
  await main();
}());

