const path = require('path');
const findRoot = require('./lib/find-root');
const { readJsonFile } = require("./lib/fs");
const rootPath = findRoot(process.cwd());
const argv = require('minimist')(process.argv.slice(2));
const distPath = path.resolve(rootPath, 'dist');

function LoadPackageJsonFiles(libraries) {
  libraries.forEach(library =>  {
    library.pkg = readJsonFile(path.resolve(library.sourcePath, 'package.json'));
  })
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

module.exports = { argv, rootPath, distPath, libraries, grabSelectedlibraries };
