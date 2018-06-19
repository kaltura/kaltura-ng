#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { copyFolders } = require('./utils');
const { rootPath, distPath } = require('../definitions');

function executeNGBuild(libraryName) {
  const buildCommand = 'ng';
  const buildArgs = ['build', libraryName];

  console.log(`run command '${buildCommand} ${buildArgs.join(' ')}'`);
  const result = spawnSync(buildCommand, buildArgs, {stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`build failed for ${libraryName} with status ${result.status}`);
  }
}

async function buildLibrary(library) {
  console.log(`build library '${library.name}`);
  switch (library.name) {
    case "@kaltura-ng/kaltura-logger":
      executeNGBuild('@kaltura-ng/kaltura-logger');
      break;
    case "@kaltura-ng/kaltura-common":
      executeNGBuild('@kaltura-ng/kaltura-common');
      break;
    case "@kaltura-ng/kaltura-ui": {
      executeNGBuild('@kaltura-ng/kaltura-ui');
      const source = path.resolve(rootPath, 'projects/kaltura-ng/kaltura-ui/src/styles');
      const target = path.resolve(distPath, 'kaltura-ng/kaltura-ui/styles');
      await copyFolders(source, target);
    }
      break;
    case "@kaltura-ng/kaltura-primeng-ui": {
      executeNGBuild('@kaltura-ng/kaltura-primeng-ui');
      const source = path.resolve(rootPath, 'projects/kaltura-ng/kaltura-primeng-ui/src/styles');
      const target = path.resolve(distPath, 'kaltura-ng/kaltura-primeng-ui/styles');
      await copyFolders(source, target);
    }
      break;
    case "@kaltura-ng/mc-shared":
      executeNGBuild('@kaltura-ng/mc-shared');
      break;
    case "@kaltura-ng/mc-theme":
      const buildCommand = 'npm';
      const buildArgs = ['run', 'build'];
      const cwd = path.resolve(rootPath, 'projects/kaltura-ng/mc-theme');

      console.log(`build @kaltura-ng/mc-theme library`);
      const result = spawnSync(buildCommand, buildArgs, {cwd, stdio: 'inherit', stderr: 'inherit'});

      if (result.status !== 0) {
        throw new Error(`build failed for @kaltura-ng/mc-theme with status ${result.status}`);
      }
      break;
    default:
      throw new Error(`missing build instructions for '${library.name}' (did you forget to add instructions in 'scripts/libs/build-library.js' file?)`);
      break;
  }
}

module.exports = { buildLibrary };
