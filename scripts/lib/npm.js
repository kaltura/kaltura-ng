const log = require("npmlog");
const { executeCommand } = require('./fs');


function npmPublishLibrary(name, cwd) {
  log.silly("npmPublish", name);
  const args = ["publish"];
  // TODO remove log and uncomment command
  log.verbose("npm", args.join(' '), { cwd });
  //return executeCommand('npm', args, { cwd });
}

module.exports = { npmPublishLibrary }
