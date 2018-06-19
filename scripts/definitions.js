const path = require('path');
const findRoot = require('./lib/find-root');

const rootPath = findRoot(process.cwd());
const argv = require('minimist')(process.argv.slice(2));

const distPath = path.resolve(rootPath, 'dist');
const libraries = [
  {
    name: '@kaltura-ng/kaltura-logger',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-logger'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-logger')
  },
  {
    name: '@kaltura-ng/kaltura-common',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-common'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-common')
  },
  {
    name: '@kaltura-ng/kaltura-ui',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-ui'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-ui')
  },
  {
    name: '@kaltura-ng/kaltura-primeng-ui',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-primeng-ui'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-primeng-ui')
  },
  {
    name: '@kaltura-ng/mc-shared',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-shared'),
    distPath: path.resolve(distPath, 'kaltura-ng/mc-shared')
  },
  {
    name: '@kaltura-ng/mc-theme',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-theme'),
    distPath: path.resolve(distPath, 'kaltura-ng/mc-theme')
  }
];

  module.exports = { argv, rootPath, distPath, libraries };
