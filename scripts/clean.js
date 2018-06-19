#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { deleteFolder, grabSelectedlibraries } = require('./lib/utils');

async function main() {
  console.log(`clean libraries`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    const nodeModulesPath = path.resolve(library.sourcePath,"node_modules");

    console.log(`delete 'node_modules' folder of library '${library.name}'`);
    deleteFolder(nodeModulesPath);

    console.log(`delete dist folder of library '${library.name}'`);
    deleteFolder(library.distPath);
  }
}

(async function() {
  await main();
}());

