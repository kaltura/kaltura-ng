#!/usr/bin/env node
const log = require("npmlog");
const { setupLibraries } = require('./setup/setup-libraries');
const { executeNPMLinkToLibrary } = require('./link/link-packages');
const { workspaceLibraries } = require('./link/definitions');
const { executeCommand } = require('./lib/fs');
const { options } = require('./build/definitions');

(async function() {
  log.info('setup command', `execute command`);

  log.info('repository', 'install repository dependencies');
  executeCommand('npm', ['install']);

  await setupLibraries();

  if (options.link) {
    log.info('repository', 'setup kaltura-ng storybook workspace');
    for (let i = 0; i < workspaceLibraries.length; i++) {
      const library = workspaceLibraries[i];
      await executeNPMLinkToLibrary(library);
    }
  }
}());

