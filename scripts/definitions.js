const log = require("npmlog");
const path = require('path');
const findRoot = require('./lib/find-root');
const { readJsonFile } = require("./lib/fs");
const rootPath = findRoot(process.cwd());
const argv = require('minimist')(process.argv.slice(2));
const distPath = path.resolve(rootPath, 'dist');
const { copyFolders, executeCommand } = require('./lib/fs');

function LoadPackageJsonFiles(libraries) {
  libraries.forEach(library =>  {
    library.pkg = readJsonFile(path.resolve(library.sourcePath, 'package.json'));
  })
}

function grabSelectedlibraries() {
  const specificLibrary = argv['library'] ? `@kaltura-ng/${argv['library']}` : '';
  let adapters = new Set();

  log.verbose('', `grab user selected libraries (${specificLibrary || 'all libraries'})`);
  if (specificLibrary) {
    const adapter = Array.from(libraries).find(adapter => adapter.name === specificLibrary);

    if (adapter) {
      adapters.add(adapter);
    } else {
      log.error(`unknown library requested '${specificLibrary}'`);
    }
  } else {
    adapters = libraries;
  }

  return adapters;
}

async function executeNGBuild(libraryName) {
  executeCommand('ng', ['build', libraryName]);
}

async function buildLibraries(libraries) {
  const librariesNames = Array.from(libraries).reduce((result, {name}) => {result.push(name); return result;}, []).join(', ');
  log.verbose('build libraries', librariesNames);
  for (var it = libraries.values(), library= null; library=it.next().value; ) {
    await buildLibrary(library);

  }
  return Promise.resolve();
}

async function buildLibrary(library) {
  const libraryName = library? library.name : null;
  log.info(`build library '${libraryName}'`);
  switch (libraryName) {
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
      executeCommand('node', ['./scripts/build.js'], {cwd});
      break;
    default:
      throw new Error(`missing build instructions for '${libraryName}' (did you forget to add instructions in 'scripts/libraries.js' file?)`);
      break;
  }
}


const kalturaLogger = {
  name: '@kaltura-ng/kaltura-logger',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-logger'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-logger'),
  dependencies: new Set(),
  dependents: new Set()
};

const kalturaCommon = {
  name: '@kaltura-ng/kaltura-common',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-common'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-common'),
  dependencies: new Set(),
  dependents: new Set()
};

const kalturaUI = {
  name: '@kaltura-ng/kaltura-ui',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-ui'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-ui'),
  dependencies: new Set(),
  dependents: new Set()

};

const kalturaPrimeUI = {
  name: '@kaltura-ng/kaltura-primeng-ui',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-primeng-ui'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-primeng-ui'),
  dependencies: new Set(),
  dependents: new Set()
}

const mcShared = {
  name: '@kaltura-ng/mc-shared',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-shared'),
  distPath: path.resolve(distPath, 'kaltura-ng/mc-shared'),
  dependencies: new Set(),
  dependents: new Set()
}

const mcTheme = {
  name: '@kaltura-ng/mc-theme',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-theme'),
  distPath: path.resolve(distPath, 'kaltura-ng/mc-theme'),
  dependencies: new Set(),
  dependents: new Set()
}

function updateDependencies(library, dependencies) {
  library.dependencies = dependencies;

  dependencies.forEach(dependency => {
    dependency.dependents.add(library);
  })
}

// TODO should extract peer depenedencies and build order automatically from package.json of libraries
updateDependencies(kalturaUI, [kalturaCommon]);
updateDependencies(kalturaPrimeUI, [kalturaCommon, kalturaUI]);
updateDependencies(mcShared, [kalturaCommon, kalturaUI, kalturaLogger]);

const libraries = new Set([kalturaLogger, kalturaCommon, kalturaUI, kalturaPrimeUI, mcShared, mcTheme]);

LoadPackageJsonFiles(libraries);

module.exports = { argv, rootPath, distPath, libraries, grabSelectedlibraries, buildLibrary, buildLibraries};
