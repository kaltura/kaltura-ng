const path = require('path');
const findRoot = require('./libs/find-root');

const rootPath = findRoot(process.cwd());
const argv = require('minimist')(process.argv.slice(2));

const distPath = path.resolve(rootPath, 'dist');
const libraries = [
  {
    key: '@kaltura-ng/kaltura-logger',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-logger'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-logger')
  },
  {
    key: '@kaltura-ng/kaltura-common',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-common'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-common')
  },
  {
    key: '@kaltura-ng/kaltura-ui',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-ui'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-ui')
  },
  {
    key: '@kaltura-ng/kaltura-primeng-ui',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/kaltura-primeng-ui'),
    distPath: path.resolve(distPath, 'kaltura-ng/kaltura-primeng-ui')
  },
  {
    key: '@kaltura-ng/mc-shared',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-shared'),
    distPath: path.resolve(distPath, 'kaltura-ng/mc-shared')
  },
  {
    key: '@kaltura-ng/mc-theme',
    sourcePath: path.resolve(rootPath, 'projects/kaltura-ng/mc-theme'),
    distPath: path.resolve(distPath, 'kaltura-ng/mc-theme')
  }
];

module.exports = { argv, rootPath, distPath, libraries };
