const semver = require("semver");
const log = require("npmlog");
const conventionalRecommendedBump = require('conventional-recommended-bump');


function getVersionsForUpdates(library) {
  return new Promise((resolve, reject) => {
    log.silly('get version', `for ${library.name} at ${library.sourcePath}`);
    conventionalRecommendedBump(
      {
        tagPrefix: `${library.name}@`,
        path: library.sourcePath,
        preset: 'angular'
      },
      (err, release) => {
        if (err) {
          return reject(err);
        } else {
          const newVersion = semver.inc(library.pkg.version, release.releaseType);
          log.verbose('get version', `increment ${library.name} by ${release.releaseType} from ${library.pkg.version} to ${newVersion} (${release.reason})`);
          resolve(newVersion);
        }
      }
    );
  });
}



module.exports = { getVersionsForUpdates };
