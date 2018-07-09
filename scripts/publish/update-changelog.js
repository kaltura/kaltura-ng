const log = require("npmlog");
const { readFile, writeFile } = require('../lib/utils');
const conventionalChangelog = require('conventional-changelog');
const path = require('path');

function updateChangelog(library, newVersion) {
  return new Promise((resolve, reject) => {
    let { filePath, content: oldContent } = getChangelogContent(library.sourcePath);

    log.verbose(library.name, 'update file changelog.md');
    if (oldContent.indexOf('<a name=') !== -1) {
      oldContent = oldContent.substring(oldContent.indexOf('<a name='));
    }

    let content = '';

    // TODO check if can set header to "Change Log"
    let changelogStream = conventionalChangelog(
      {
        preset: 'angular',
        tagPrefix: `${library.name}@`
      },
      { version: newVersion },
      {
        path: library.sourcePath,
        merges: null
      }
    ).on('error', err => reject(err));

    changelogStream.on('data', buffer => {
      content += buffer.toString();
    });

    changelogStream.on('end', function () {
      const changelog = (content + oldContent).replace(/\n+$/, '\n');
      writeFile(filePath, changelog);
      return resolve(changelog);
    })
  })
}

function getChangelogContent(cwd) {
  const changeLogPath = path.resolve(cwd, 'changelog.md');
  createIfMissing(changeLogPath);
  const content = readFile(changeLogPath);

  return {filePath: changeLogPath, content};
}

function createIfMissing(file) {
  try {
    fsAccess.sync(file, fs.F_OK)
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(file, '\n');
    }
  }
}

module.exports = { updateChangelog };
