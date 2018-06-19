#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const findRoot = require('./libs/find-root');
const rimraf = require('./libs/rimraf');
const spawnSync = require('child_process').spawnSync;
const copy = require('recursive-copy');

// Use folder with nearest package.json as root
const rootPath = findRoot(process.cwd());
const argv = require('minimist')(process.argv.slice(2));
const distFolder = path.resolve(rootPath, 'dist');
const libraryAdapters = [
  {
    key: '@kaltura-ng/kaltura-logger',
    distPath: path.resolve(distFolder, 'kaltura-ng/kaltura-logger'),
    build: async () => {
      buildLibrary('@kaltura-ng/kaltura-logger');
    }
  },
  {
    key: '@kaltura-ng/kaltura-common',
    distPath: path.resolve(distFolder, 'kaltura-ng/kaltura-common'),
    build: async () => {
      buildLibrary('@kaltura-ng/kaltura-common');
    }
  },
  {
    key: '@kaltura-ng/kaltura-ui',
    distPath: path.resolve(distFolder, 'kaltura-ng/kaltura-ui'),
    build: async () => {
      buildLibrary('@kaltura-ng/kaltura-ui');
      await copyAssets('projects/kaltura-ng/kaltura-ui/src/styles', 'kaltura-ng/kaltura-ui/styles');
    }

  },
  {
    key: '@kaltura-ng/kaltura-primeng-ui',
    distPath: path.resolve(distFolder, 'kaltura-ng/kaltura-primeng-ui'),
    build: async () => {
      buildLibrary('@kaltura-ng/kaltura-primeng-ui');
      await copyAssets('projects/kaltura-ng/kaltura-primeng-ui/src/styles', 'kaltura-ng/kaltura-primeng-ui/styles');
    }
  },
  {
    key: '@kaltura-ng/mc-shared',
    distPath: path.resolve(distFolder, 'kaltura-ng/mc-shared'),
    build: async () => {
      buildLibrary('@kaltura-ng/mc-shared');
    }
  },
  {
    key: '@kaltura-ng/mc-theme',
    distPath: path.resolve(distFolder, 'kaltura-ng/mc-theme'),
    build: async () => {
      const buildCommand = 'npm';
      const buildArgs = ['run', 'build'];
      const cwd = path.resolve(rootPath, 'projects/kaltura-ng/mc-theme');

      console.log(`build @kaltura-ng/mc-theme library`);
      const result = spawnSync(buildCommand, buildArgs, {cwd, stdio: 'inherit', stderr: 'inherit'});

      if (result.status !== 0) {
        throw new Error(`build failed for @kaltura-ng/mc-theme with status ${result.status}`);
      }
    }
  }
];

function buildLibrary(libraryName) {
  const buildCommand = 'ng';
  const buildArgs = ['build', libraryName];

  console.log(`run command '${buildCommand} ${buildArgs.join(' ')}'`);
  const result = spawnSync(buildCommand, buildArgs, {stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`build failed for ${libraryName} with status ${result.status}`);
  }

  linkLibrary(libraryName);
}

function linkLibrary(libraryName) {
  const buildCommand = 'npm';
  const buildArgs = ['link'];
  const {distPath} = libraryAdapters.find(adapter => adapter.key === libraryName);

  console.log(`link '${libraryName}' library (path = ${distPath})`);
  const result = spawnSync(buildCommand, buildArgs, {cwd: distPath, stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`link failed for '${libraryName}' with status ${result.status}`);
  }
}

function deleteFolder(path)
{
  var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

  if (path) {
    console.log(`delete folder ${path}`);
    deleteFolderRecursive(path);
  }
}

async function copyAssets(source, target) {
  try {
    const sourceFilePath = path.resolve(rootPath, source);
    const targetFilePath = path.resolve(distFolder, target);
    rimraf.sync(target);
    const result = await copy(sourceFilePath, targetFilePath);
    console.log(`copied ${result.length} assets from '${source}' into '${target}'`);
  } catch (ex) {
    console.log(`failed to copy assets from '${source}' into '${target}'`);
    throw ex;
  }
}


async function main() {
  const specificLibrary = argv['library'] ? `@kaltura-ng/${argv['library']}` : '';
  let adapters = [];

  console.log(`grab repo libraries (${specificLibrary || 'all libraries'})`);
  if (specificLibrary) {
    const adapter = libraryAdapters.find(adapter => adapter.key === specificLibrary);

    if (adapter) {
      adapters.push(adapter);
    } else {
      console.error(`unknown library requested '${specificLibrary}'`);
    }
  } else {
    adapters = libraryAdapters;
  }

  if (argv['deleteDist']) {
    console.log(`delete libraries dist`);
    for (let i = 0; i < adapters.length; i++) {
      const adapter = adapters[i];
      deleteFolder(adapter.distPath);
    }
  }

  console.log(`build libraries`);
  for (let i = 0; i < adapters.length; i++) {
    const adapter = adapters[i];
    await adapter.build();
  }
}

(async function() {
  await main();
}());

