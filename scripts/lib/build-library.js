#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { copyFolders, executeCommand } = require('./fs');
const { rootPath, distPath } = require('../definitions');

async function executeNGBuild(libraryName) {
  executeCommand('ng', ['build', libraryName]);
}

async function buildLibrary(library) {
  console.log(`build library '${library.name}`);
  switch (library.name) {
    case "@kaltura-ng/kaltura-logger":
      await executeNGBuild('@kaltura-ng/kaltura-logger');
      break;
    case "@kaltura-ng/kaltura-common":
      await executeNGBuild('@kaltura-ng/kaltura-common');
      break;
    case "@kaltura-ng/kaltura-ui": {
      await executeNGBuild('@kaltura-ng/kaltura-ui');
      const source = path.resolve(rootPath, 'projects/kaltura-ng/kaltura-ui/src/styles');
      const target = path.resolve(distPath, 'kaltura-ng/kaltura-ui/styles');
      await copyFolders(source, target);
    }
      break;
    case "@kaltura-ng/kaltura-primeng-ui": {
      await executeNGBuild('@kaltura-ng/kaltura-primeng-ui');
      const source = path.resolve(rootPath, 'projects/kaltura-ng/kaltura-primeng-ui/src/styles');
      const target = path.resolve(distPath, 'kaltura-ng/kaltura-primeng-ui/styles');
      await copyFolders(source, target);
    }
      break;
    case "@kaltura-ng/mc-shared":
      await executeNGBuild('@kaltura-ng/mc-shared');
      break;
    case "@kaltura-ng/mc-theme":
      const cwd = path.resolve(rootPath, 'projects/kaltura-ng/mc-theme');
      executeCommand('npm', ['run', 'build'], cwd);
      break;
    default:
      throw new Error(`missing build instructions for '${library.name}' (did you forget to add instructions in 'scripts/libs/build-library.js' file?)`);
      break;
  }
}

module.exports = { buildLibrary };
