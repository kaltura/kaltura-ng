const path = require('path');
const findRoot = require('./lib/find-root');

const rootPath = findRoot(process.cwd());
const argv = require('minimist')(process.argv.slice(2));
const distPath = path.resolve(rootPath, 'dist');

const kalturaLogger = {
  name: '@kaltura-ng/kaltura-logger',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-logger'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-logger'),
  dependencies: [],
  dependents: []
};

const kalturaCommon = {
  name: '@kaltura-ng/kaltura-common',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-common'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-common'),
  dependencies: [],
  dependents: []
};

const kalturaUI = {
  name: '@kaltura-ng/kaltura-ui',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-ui'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-ui'),
  dependencies: [],
  dependents: []

};

const kalturaPrimeUI = {
  name: '@kaltura-ng/kaltura-primeng-ui',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-primeng-ui'),
  distPath: path.resolve(distPath, 'kaltura-ng/kaltura-primeng-ui'),
  dependencies: [],
  dependents: []
}

const mcShared = {
  name: '@kaltura-ng/mc-shared',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-shared'),
  distPath: path.resolve(distPath, 'kaltura-ng/mc-shared'),
  dependencies: [],
  dependents: []
}

const mcTheme = {
  name: '@kaltura-ng/mc-theme',
  sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-theme'),
  distPath: path.resolve(distPath, 'kaltura-ng/mc-theme'),
  dependencies: [],
  dependents: []
}

function updateDependencies(library, dependencies) {
  library.dependencies = dependencies;

  dependencies.forEach(dependency => {
    dependency.dependents.push(library);
  })
}

// TODO should extract depenedencies and build order automatically from package.json of libraries

updateDependencies(kalturaUI, [kalturaCommon]);
updateDependencies(kalturaPrimeUI, [kalturaCommon, kalturaUI]);
updateDependencies(mcShared, [kalturaCommon, kalturaUI, kalturaLogger]);

const libraries = [kalturaLogger, kalturaCommon, kalturaUI, kalturaPrimeUI, mcShared, mcTheme];

module.exports = { argv, rootPath, distPath, libraries };
