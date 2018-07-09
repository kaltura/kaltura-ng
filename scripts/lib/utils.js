const fs = require('fs');
const log = require("npmlog");
const execa = require('execa');
const copy = require('recursive-copy');
const rimraf = require('./rimraf');
const loadJsonFile = require("load-json-file");
const doWriteJsonFile = require("write-json-file");

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

function readJsonFile(path) {
  log.silly('readJsonFile', `path ${path}`);
  if (!path) {
    throw new Error(`failed to read json file content`);
  }

  return loadJsonFile.sync(path);
}

function writeJsonFile(path, content, indent = 2) {
  log.silly('writeJsonFile', `path ${path}`);
  return doWriteJsonFile.sync(path, content, {indent});
}

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}
function writeFile(path, content) {
  return fs.writeFileSync(path, content);
}

module.exports = {  deleteFolder, copyFolders, executeCommand, readJsonFile, writeJsonFile, readFile, writeFile };
