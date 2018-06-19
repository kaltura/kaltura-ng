#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const { rootPath, copyFolders, grabSelectedlibraries } = require('./utils');

async function main() {
  console.log(`setup libraries`);
  const libraries = grabSelectedlibraries();

    for (let i = 0; i < libraries.length; i++) {
      const library = libraries[i];
      const buildCommand = 'npm';
      const buildArgs = ['install'];
      const cwd = library.sourcePath;

      console.log(`npm intall library '${library.key}' (path = ${cwd})`);
      // const result = spawnSync(buildCommand, buildArgs, {cwd: cwd, stdio: 'inherit', stderr: 'inherit'});
      //
      // if (result.status !== 0) {
      //   throw new Error(`npm install failed for '${libraryName}' with status ${result.status}`);
      // }

      const packageJsonPath = path.resolve(cwd, 'package.json');
      var packageJson = fs.readFileSync(packageJsonPath, "utf8");

      console.log(packageJson);
    }
}

(async function() {
  await main();
}());

