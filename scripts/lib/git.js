const log = require("npmlog");
const { executeCommand } = require('./fs');
const tempWrite = require("temp-write");
const os = require('os');

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

function gitCommit(message) {
  log.silly("gitCommit", message);
  const args = ["commit", "--no-verify"];

  if (message.indexOf(os.EOL) > -1) {
    // Use tempfile to allow multi\nline strings.
    args.push("-F", tempWrite.sync(message, "kaltura-commit.txt"));
  } else {
    args.push("-m", message);
  }

  // TODO remove log and uncomment command
  log.verbose("git", args.join(' '));
  //return executeCommand("git", args);
}


function gitTag(tag) {
  log.silly("gitTag", tag);
  const args = ["tag", tag, "-m", tag];

  // TODO remove log and uncomment command
  log.verbose("git", args.join(' '));
  //return executeCommand("git", args);
}


function gitPush(remote, branch) {
  log.silly("gitPush", remote, branch);
  const args = ["push", "--follow-tags", "--no-verify", remote, branch];

  // TODO remove log and uncomment command
  log.verbose("git", args.join(' '));
  //return executeCommand("git", args);
}



module.exports = { getCurrentBranch, hasUnCommittedChanges, hasTags, gitCommit, gitTag, gitPush }
