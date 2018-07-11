const findRoot = require('./lib/find-root');
const path = require('path');

const rootPath = findRoot(process.cwd());
const distPath = path.resolve(rootPath, 'dist');

module.exports = { distPath, rootPath };
