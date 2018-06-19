#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var findRoot = require('./libs/find-root');
var rimraf = require('./libs/rimraf');
var spawnSync = require('child_process').spawnSync;
var copy = require('recursive-copy');


// Use folder with nearest package.json as root
var rootPath = findRoot(process.cwd());
const distFolder = path.resolve(rootPath, 'dist');

function buildLibrary(libraryName) {
  const buildCommand = 'ng';
  const buildArgs = ['build',libraryName];

  console.log(`running ${buildCommand} ${buildArgs.join(' ')}`);
  const result = spawnSync(buildCommand, buildArgs, { stdio: 'inherit', stderr: 'inherit' });

  if (result.status !== 0) {
    throw new Error(`build failed for ${libraryName} with status ${result.status}`);
  }
}

function buildMCThemeLibrary() {
  const buildCommand = 'npm';
  const buildArgs = ['run','build'];
  const cwd = path.resolve(rootPath, 'projects/kaltura-ng/mc-theme');

  console.log(`build @kaltura-ng/mc-theme library`);
  const result = spawnSync(buildCommand, buildArgs, { cwd, stdio: 'inherit', stderr: 'inherit' });

  if (result.status !== 0) {
    throw new Error(`build failed for @kaltura-ng/mc-theme with status ${result.status}`);
  }
}


async function copyAssets(source, target) {

  try {
    const sourceFilePath = path.resolve(rootPath,source);
    const targetFilePath = path.resolve(distFolder,target);
    rimraf.sync(target);
    const result = await copy(sourceFilePath, targetFilePath);
    console.log(`copied ${result.length} assets from '${source}' into '${target}'`);
  } catch (ex) {
    console.log(`failed to copy assets from '${source}' into '${target}'`);
    throw ex;
  }

}


(async function () {
  buildLibrary('@kaltura-ng/kaltura-logger');
  buildLibrary('@kaltura-ng/kaltura-common');
  buildLibrary('@kaltura-ng/kaltura-ui');
  await copyAssets('projects/kaltura-ng/kaltura-ui/src/styles', 'kaltura-ng/kaltura-ui/styles');

  buildLibrary('@kaltura-ng/kaltura-primeng-ui');
  await copyAssets('projects/kaltura-ng/kaltura-primeng-ui/src/styles', 'kaltura-ng/kaltura-primeng-ui/styles');

  buildLibrary('@kaltura-ng/mc-shared');

  buildMCThemeLibrary();

}());

