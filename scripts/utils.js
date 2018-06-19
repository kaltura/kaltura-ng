
const { argv, libraries } = require('./definitions');

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

function grabSelectedlibraries() {
  const specificLibrary = argv['library'] ? `@kaltura-ng/${argv['library']}` : '';
  let adapters = [];

  console.log(`grab user selected libraries (${specificLibrary || 'all libraries'})`);
  if (specificLibrary) {
    const adapter = libraries.find(adapter => adapter.key === specificLibrary);

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

module.exports = {  deleteFolder, copyFolders, grabSelectedlibraries }
