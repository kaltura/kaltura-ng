#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { deleteFolder, grabSelectedlibraries } = require('./utils');

async function main() {
  console.log(`clean libraries`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    const nodeModulesPath = path.resolve(library.sourcePath,"nodeModules");
    console.log(`delete folder 'nodeModules' for library '${library.key}'`);
    deleteFolder(nodeModulesPath);
  }
}

(async function() {
  await main();
}());

