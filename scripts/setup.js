#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { deleteFolder, grabSelectedlibraries } = require('./lib/utils');
const { buildLibrary } = require('./lib/build-library');

function executeNPMLinkForLibrary(library) {
  const buildCommand = 'npm';
  const buildArgs = ['link'];

  console.log(`execute npm link for library '${library.name}`);
  const result = spawnSync(buildCommand, buildArgs, {cwd: library.distPath, stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`link failed for '${library.name}' with status ${result.status}`);
  }
}

async function main() {
  console.log(`setup libraries`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    deleteFolder(library.distPath);
  }

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];
    const buildCommand = 'npm';
    const buildArgs = ['install'];
    const cwd = library.sourcePath;

    console.log(`npm intall library '${library.name}'`);
    // const result = spawnSync(buildCommand, buildArgs, {cwd: cwd, stdio: 'inherit', stderr: 'inherit'});
    //
    // if (result.status !== 0) {
    //   throw new Error(`npm install failed for '${libraryName}' with status ${result.status}`);
    // }

    await buildLibrary(library);
    executeNPMLinkForLibrary(library);
  }
}

(async function() {
  await main();
}());

