const fs = require('fs');
const log = require("npmlog");
const execa = require('execa');
const copy = require('recursive-copy');
const rimraf = require('./rimraf');
const { argv, libraries } = require('../definitions');

function executeCommand(command, commandArgs, opt) {
  log.info('execute command',`${command} ${commandArgs.join(' ')}`);
  const result = execa.sync(command, commandArgs, opt);
  return result.stdout;
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
