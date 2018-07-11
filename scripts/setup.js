#!/usr/bin/env node
const log = require("npmlog");
const { setupLibraries } = require('./setup/setup-libraries');
const { executeCommand } = require('./lib/fs');

(async function() {
  log.info('setup command', `execute command`);

  log.info('repository', 'install repository dependencies');
  executeCommand('npm', ['install']);

  await setupLibraries();
}());

