const os = require("os");
const { gitCommit, gitTag } = require('../lib/git');

async function commitAndTagUpdates(updates) {
  const tags = Array.from(updates).map(([,update])  => `${update.library.name}@${update.newVersion}`);
  const subject = "Publish";
  const message = tags.reduce((msg, tag) => `${msg}${os.EOL} - ${tag}`, `${subject}${os.EOL}`);

  return Promise.resolve()
    .then(() => gitCommit(message, this.execOpts))
    .then(() => Promise.all(tags.map(tag => gitTag(tag, this.execOpts))))
    .then(() => tags);
}

module.exports = { commitAndTagUpdates };
