#!/usr/bin/env node
const log = require("npmlog");
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { grabSelectedlibraries } = require('./libraries');
const { deleteFolder } = require('./lib/fs');

async function main() {
  log.info('clean command', `execute command`);
  const libraries = grabSelectedlibraries();

  for (let it = libraries.values(), library= null; library=it.next().value; ) {
    const nodeModulesPath = path.resolve(library.sourcePath, "node_modules");

    log.info(library.name, `delete library 'node_modules' folder`);
    deleteFolder(nodeModulesPath);

    log.info(library.name, `delete library dist folder`);
    deleteFolder(library.distPath);
  }
}

(async function() {
  await main();
}());

