const log = require("npmlog");
const { executeCommand } = require('./utils');

function getCurrentBranch() {
  const branch = executeCommand("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
  log.verbose("current Branch", branch);
  return branch;
}

function hasUnCommittedChanges() {
  return !!executeCommand("git", ["status","-s"]);
}

function hasTags(opts) {
  log.silly("hasTags");
  let result = false;

  try {
    result = !!executeCommand("git", ["tag"], opts);
  } catch (err) {
    log.warn("ENOTAGS", "No git tags were reachable from this branch!");
    log.verbose("hasTags error", err);
  }

  log.verbose("hasTags", result);

  return result;
}

module.exports = { getCurrentBranch, hasUnCommittedChanges, hasTags }
