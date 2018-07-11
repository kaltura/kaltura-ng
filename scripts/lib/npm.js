const log = require("npmlog");
const { executeCommand } = require('./fs');


function npmPublishLibrary(name, cwd) {
  log.silly("npmPublish", name);
  const args = ["publish"];
  return executeCommand('npm', args, { cwd });
}

module.exports = { npmPublishLibrary }
