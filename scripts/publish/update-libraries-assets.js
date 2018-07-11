const log = require("npmlog");
const { readFile, writeFile } = require('../lib/fs');
const conventionalChangelog = require('conventional-changelog');
const path = require('path');
const { readJsonFile, writeJsonFile, createIfMissing } = require('../lib/fs');
const { EOL } = require('os');

function updatePackageLockFile(library, newVersion) {
  log.verbose(library.name, `update package-lock.json version to ${newVersion}`);
  const pkgLockFilePath = path.resolve(library.sourcePath, 'package-lock.json');
  const pkgLockFileContent = readJsonFile(pkgLockFilePath);
  pkgLockFileContent.version = newVersion;
  // TODO learn indentation from file
  writeJsonFile(pkgLockFilePath, pkgLockFileContent, 2);
}

function updatePackageFile(library, newVersion, updates) {
  const pkg = library.pkg;
  pkg.version = newVersion; //make sure the in-memory package is synced as well.
  library.dependencies.forEach(dependency => {
    const updatedLibrary = updates.get(dependency.name);
    if (updatedLibrary) {
      const peerDependencies = pkg.peerDependencies;

      if (!peerDependencies || !peerDependencies[dependency.name]) {
        const errorMessage = `missing peerDependency for '${dependency.name}'`;
        log.error(library.name, errorMessage);
        throw new Error(errorMessage);
      }

      pkg.peerDependencies[dependency.name] = updatedLibrary.newVersion;
    }
  });
  // TODO learn indentation from file
  writeJsonFile(path.resolve(library.sourcePath, 'package.json'), pkg, 2);
}

async function updateLibrariesAssets(updates) {
  for (var it = updates.values(), update = null; update = it.next().value;) {
    const { library, newVersion } = update;
    updatePackageFile(library, newVersion, updates);
    updatePackageLockFile(library, newVersion);
    await updateChangelog(library, newVersion);
  }
}

function updateChangelog(library, newVersion) {
  return new Promise((resolve, reject) => {
    let { filePath, content: oldContent } = getChangelogContent(library.sourcePath);

    log.verbose(library.name, 'update file changelog.md', { filePath });
    if (oldContent.indexOf('<a name=') !== -1) {
      oldContent = oldContent.substring(oldContent.indexOf('<a name='));
    }

    let content = '';
    
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
      content = content.replace(/[\n\r]+$/, "");
      if (content.split('\n').length === 2) {
        content += `${EOL}${EOL}* update dependent libraries versions`;
      }

      const changelog = `# Change Log
${content}


${oldContent}`.replace(/\n+$/, '\n');
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


module.exports = { updateLibrariesAssets };
