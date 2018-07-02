const log = require("npmlog");
const { executeCommand } = require('./utils');

function getCurrentBranch() {
  log.silly("currentBranch");

  const branch = executeCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  log.verbose("currentBranch", branch);

  return branch;
}

module.exports = { getCurrentBranch }
