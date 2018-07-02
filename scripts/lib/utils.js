const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
const copy = require('recursive-copy');
const rimraf = require('./rimraf');
const { argv, libraries } = require('../definitions');

function executeCommand(command, commandArgs, cwd) {
  console.log(`execute command '${command} ${commandArgs.join(' ')}' ${cwd ? `cwd = ${cwd}` : ''}`);
  const result = spawnSync(command, commandArgs, {cwd, stdio: 'inherit', stderr: 'inherit'});

  if (result.status !== 0) {
    throw new Error(`execute command failed with status ${result.status}`);
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

async function copyFolders(source, target) {
  try {
    if (source && target) {
      rimraf.sync(target);
      const result = await copy(source, target);
      console.log(`copied ${result.length} files from '${source}' into '${target}'`);
    }
  } catch (ex) {
    console.log(`failed to copy files from '${source}' into '${target}'`);
    throw ex;
  }
}

function grabSelectedlibraries() {
  const specificLibrary = argv['library'] ? `@kaltura-ng/${argv['library']}` : '';
  let adapters = [];

  console.log(`grab user selected libraries (${specificLibrary || 'all libraries'})`);
  if (specificLibrary) {
    const adapter = libraries.find(adapter => adapter.name === specificLibrary);

    if (adapter) {
      adapters.push(adapter);
    } else {
      console.error(`unknown library requested '${specificLibrary}'`);
    }
  } else {
    adapters = libraries;
  }

  return adapters;
}

module.exports = {  deleteFolder, copyFolders, grabSelectedlibraries, executeCommand };
