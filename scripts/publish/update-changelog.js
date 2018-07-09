const log = require("npmlog");
const { readFile, writeFile } = require('../lib/utils');
const conventionalChangelog = require('conventional-changelog');
const path = require('path');
const { readJsonFile, writeJsonFile } = require('../lib/utils');

async function updateLibraries(updatedLibraries) {
  updatedLibraries.forEach(({ library, newVersion }) => {
    ['package.json', 'package-lock.json'].forEach(pkgFileName => {
      log.verbose(library.name, `update ${pkgFileName} version to ${newVersion}`);
      const pkgFilePath = path.resolve(library.sourcePath, pkgFileName);
      const pkgFileContent = readJsonFile(pkgFilePath);

      pkgFileContent.version = newVersion;

      if (pkgFileName === 'package.json') {
        library.dependencies.forEach(dependency => {
          const updatedLibrary = updatedLibraries.get(dependency.name);
          if (updatedLibrary) {
            const peerDependencies = pkgFileContent.peerDependencies;

            if (!peerDependencies || !peerDependencies[dependency.name]) {
              const errorMessage = `missing peerDependency for '${dependency.name}'`;
              log.error(library.name, errorMessage);
              throw new Error(errorMessage);
            }

            pkgFileContent.peerDependencies[dependency.name] = updatedLibrary.newVersion;
          }
        });
      }

      // TODO learn indentation from file
      writeJsonFile(pkgFilePath, pkgFileContent, 2);
    });


    updateChangelog(library, newVersion);

  });
}

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

module.exports = { updateLibraries };
