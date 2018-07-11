const log = require("npmlog");
const argv = require( 'argv' );
const { rootPath, distPath } = require('../definitions');
const path = require('path');


const CONTINUE_MODE = 'CONTINUE_MODE';
const ABORT_MODE = 'ABORT_MODE';
const START_MODE = 'START_MODE';
const CI_MODE = 'CI_MODE';

var cliArgs = argv.option( [
  {
    name: 'verbose',
    type: 'boolean',
    description: 'Set logs level to verbose'
  },
  {
    name: 'forceBumpTo',
    type: 'string',
    description: "Manually define next version semver bump type. accepted values 'minor', 'major'",
    example: "'script --forceBumpTo=major'"
  },
  {
    name: 'continue',
    type: 'boolean',
    description: "Continue active publish process"
  },
  {
    name: 'abort',
    type: 'boolean',
    description: "Abort active publish process"
  },
  {
    name: 'ci',
    type: 'boolean',
    description: "Start publish process for CI"
  },
  {
    name: 'skipBuild',
    type: 'boolean',
    description: "Diagnostic flag used to debug this script, avoid using"
  },
  {
    name: 'branch',
    type: 'string',
    description: 'Defines accepted branch to publish from (default to master)',
    example: "'script --branch=nameOfBranch'"
  }
] ).run().options;

if (cliArgs['verbose']) {
  log.level = 'verbose';
}

const mode = !!cliArgs['continue'] ? CONTINUE_MODE :
  !!cliArgs['abort'] ? ABORT_MODE :
    !!cliArgs['ci'] ? CI_MODE :
      START_MODE;

const options = {
  branch: cliArgs['branch'] || 'master',
  forceBumpTo: cliArgs['forceBumpTo'],
  publishStatusPath: path.resolve(__dirname, '.publish-status'),
  skipBuild: !!cliArgs['skipBuild'] || false,
  mode,
  "ignoreChanges": [
    "ignored-file",
    "*.md"
  ]
};

log.silly('cli args', cliArgs);
log.verbose('options', '', options);


function validateOptions() {
  if (options.forceBumpTo) {
    if ((['major','minor'].indexOf(options.forceBumpTo)) === -1) {
      log.error('EOPTIONS', `expected 'forceBumpTo' to be '' (default), 'major' or 'minor', got '${options.forceBumpTo}'`);
      process.exit(1);
    }
  }

  if (options.skipBuild) {
    log.error('EOPTIONS', `option 'skipBuild' should not be in use, please abort and execute without this option`);
  }
}

validateOptions();

module.exports = { options, rootPath, distPath, CONTINUE_MODE, ABORT_MODE, START_MODE };
