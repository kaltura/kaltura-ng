#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { rootPath, copyFolders, grabSelectedlibraries } = require('./utils');

function buildLibrary(libraryName) {
  const buildCommand = 'ng';
  const buildArgs = ['build', libraryName];

  console.log(`run command '${buildCommand} ${buildArgs.join(' ')}'`);
  const result = spawnSync(buildCommand, buildArgs, {stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`build failed for ${libraryName} with status ${result.status}`);
  }
}

function linkLibrary(distPath) {
  const buildCommand = 'npm';
  const buildArgs = ['link'];

  console.log(`link path ${distPath}`);
  const result = spawnSync(buildCommand, buildArgs, {cwd: distPath, stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`link failed for '${libraryName}' with status ${result.status}`);
  }
}

async function main() {
  console.log(`build libraries`);
  const libraries = grabSelectedlibraries();

  for (let i = 0; i < libraries.length; i++) {
    const library = libraries[i];

    switch(library.key) {
      case "@kaltura-ng/kaltura-logger":
        buildLibrary('@kaltura-ng/kaltura-logger');
        linkLibrary(library.distPath);
        break;
      case "kaltura-common":
        buildLibrary('@kaltura-ng/kaltura-common');
        linkLibrary(library.distPath);
        break;
      case "@kaltura-ng/kaltura-ui":
        buildLibrary('@kaltura-ng/kaltura-ui');
        await copyFolders('projects/kaltura-ng/kaltura-ui/src/styles', 'kaltura-ng/kaltura-ui/styles');
        linkLibrary(library.distPath);
        break;
      case "@kaltura-ng/kaltura-primeng-ui":
        buildLibrary('@kaltura-ng/kaltura-primeng-ui');
        await copyFolders('projects/kaltura-ng/kaltura-primeng-ui/src/styles', 'kaltura-ng/kaltura-primeng-ui/styles');
        linkLibrary(library.distPath);
        break;
      case "@kaltura-ng/mc-shared":
        buildLibrary('@kaltura-ng/mc-shared');
        linkLibrary(library.distPath);
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

        linkLibrary(library.distPath);
        break;
      default:
        throw new Error(`missing build instructions for '${library.key}' (did you forget to add instructions in 'scripts/build.js' file?)`)
        break;

    }
  }
}

(async function() {
  await main();
}());

