const log = require("npmlog");
const { argv, buildLibraries } = require('../definitions');


async function publishLibrariesToNpm(updates) {
  log.info("publish", "Publishing packages to npm...");

  let chain = Promise.resolve();

  const libraries = Array.from(updates).reduce((result, [, {library}]) => {result.add(library); return result;},new Set());
  chain = chain.then(() => buildLibraries(libraries));
  chain = chain.then(() => npmPublish());

  return chain.then(() => {
    const message = updates.map(({library}) => ` - ${library.pkg.name}@${library.pkg.version}`);

    output("Successfully published:");
    output(message.join(os.EOL));
  });
}

function  npmPublish() {
  return Promise.resolve();
  // const tracker = this.logger.newItem("npmPublish");
  // // if we skip temp tags we should tag with the proper value immediately
  // const distTag = this.options.tempTag ? "lerna-temp" : this.getDistTag();
  // const rootPkg = this.project.manifest;
  //
  // let chain = Promise.resolve();
  //
  // chain = chain.then(() => this.runPrepublishScripts(rootPkg));
  // chain = chain.then(() =>
  //   pMap(this.updates, ({ pkg }) => {
  //     this.execScript(pkg, "prepublish");
  //
  //     return this.runPrepublishScripts(pkg);
  //   })
  // );
  //
  // tracker.addWork(this.packagesToPublish.length);
  //
  // const mapPackage = pkg => {
  //   tracker.verbose("publishing", pkg.name);
  //
  //   return npmPublish(pkg, distTag, this.npmConfig).then(() => {
  //     tracker.info("published", pkg.name);
  //     tracker.completeWork(1);
  //
  //     this.execScript(pkg, "postpublish");
  //
  //     return this.runPackageLifecycle(pkg, "postpublish");
  //   });
  // };
  //
  // chain = chain.then(() => runParallelBatches(this.batchedPackages, this.concurrency, mapPackage));
  // chain = chain.then(() => this.runPackageLifecycle(rootPkg, "postpublish"));
  //
  // return pFinally(chain, () => tracker.finish());
}

module.exports = { publishLibrariesToNpm };
