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
  spawnSync(buildCommand, buildArgs, { stdio: 'inherit' });
}

async function copyAssets(source, target) {
  console.log(`copy from '${source}' into '${target}'`);
  const sourceFilePath = path.resolve(rootPath,source);
  const targetFilePath = path.resolve(distFolder,target);
  rimraf.sync(target);
  const result = await copy(source, target);
  console.log(`copied ${result.length} files`);
}


(async function () {
  //buildLibrary('kaltura-ui');
  await copyAssets('projects/kaltura-ng/kaltura-ui/src/styles', 'kaltura-ng/kaltura-ui/styles');
  await copyAssets('projects/kaltura-ng/kaltura-primeng-ui/src/styles', 'kaltura-ng/kaltura-primeng-ui/styles');
}());

