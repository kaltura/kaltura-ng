const log = require("npmlog");
const argv = require( 'argv' );
const { rootPath, distPath } = require('../definitions');
const path = require('path');

var cliArgs = argv.option( [
  {
    name: 'verbose',
    type: 'boolean',
    description: 'Set logs level to verbose'
  },
  {
    name: 'library',
    type: 'string',
    description: "build specific library",
    example: "'script --library=@kaltura-ng/kaltura-common'"
  },
] ).run().options;

if (cliArgs['verbose']) {
  log.level = 'verbose';
}

const options = {
  specificLibrary: cliArgs.library || null
};

log.silly('cli args', cliArgs);
log.verbose('options', '', options);

module.exports = { options };
