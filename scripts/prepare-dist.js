#!/usr/bin/env node
'use strict';

// NOTICE - this code should not require libraries (it is used during preinstall).
var fs = require('fs');
var path = require('path');
var findRoot = require('./libs/find-root');
var createNpmPackageJson = require('./create-npm-package-json');
// NOTICE - this code should not require libraries (it is used during preinstall).

(async() => {
	// Use folder with nearest package.json as root
	var rootPath = findRoot(process.cwd());

	if (rootPath) {
		var distPath =  path.resolve(rootPath, 'dist');

		if (fs.existsSync(distPath)) {
			deleteFolderRecursive(distPath);
		}

		fs.mkdirSync(distPath);

		var packageJsonFilePath = path.resolve(rootPath, 'package.json');
		if (fs.existsSync(packageJsonFilePath)) {
			console.log('g');
			var packageFileContent = fs.readFileSync(packageJsonFilePath,'utf8');
			var npmPackageFileContent = createNpmPackageJson(packageFileContent);
			fs.writeFileSync(path.resolve(rootPath,'dist/package.json'),npmPackageFileContent);
		}
	}
})();


function deleteFolderRecursive(pathToDelete, rootPath) {

	if( fs.existsSync(pathToDelete) ) {
		rootPath = rootPath || findRoot(process.cwd());

		if (pathToDelete.indexOf(rootPath) === 0)
		{
			fs.readdirSync(pathToDelete).forEach(function(file,index){
				var curPath = path.join(pathToDelete, file);
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath, rootPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});

			fs.rmdirSync(pathToDelete);
		}else
		{
			throw new Error("cannot delete folder (" +  pathToDelete + ") that is not child of root package (" + rootPath + ")");
		}

	}
};




function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on("error", function (err) {
		done(err);
	});
	var wr = fs.createWriteStream(target);
	wr.on("error", function (err) {
		done(err);
	});
	wr.on("close", function (ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled) {
			cb(err);
			cbCalled = true;
		}
	}
}
