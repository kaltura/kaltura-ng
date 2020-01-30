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
  {
    name: 'link',
    type: 'boolean',
    description: "run 'npm link' command for kaltura-ng packages, required by storybook",
    example: "'script --link'"
  },
] ).run().options;

if (cliArgs['verbose']) {
  log.level = 'verbose';
}

const options = {
  specificLibrary: cliArgs.library || null,
  link: cliArgs.link || null,
};

log.silly('cli args', cliArgs);
log.verbose('options', '', options);

module.exports = { options };
