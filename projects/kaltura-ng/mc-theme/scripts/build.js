#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var shelljs = require('shelljs');
var findRoot = require('find-root');
var readJsonFile = require('read-json-file');
var writeJsonFile = require('write-json-file');

(() => {
	// Use folder with nearest package.json as root
	var rootPath = findRoot(process.cwd());

	if (rootPath) {
		var distPath =  path.resolve(rootPath, '../../../dist/kaltura-ng/mc-theme');

		if (fs.existsSync(distPath)) {
			deleteFolderRecursive(distPath);
		}

		fs.mkdirSync(distPath);

		var rootPackage = readJsonFile(path.join(rootPath,'package.json'),(err,pkg) =>
		{
			if (err )
			{
				console.error(err);
				process.exit(1);
			}

      pkg.private = false;
      pkg.peerDependencies = pkg.dependencies;
      pkg.dependencies = {};
      pkg.devDependencies = {};
      pkg.scripts = {};

      writeJsonFile.sync(path.join(distPath,'package.json'), pkg, { indent : 2});
		});

		shelljs.config.fatal = true;
		shelljs.cp('-r',['README.md','themes'],distPath);
	}
})();


function deleteFolderRecursive(pathToDelete, rootPath) {

	if( fs.existsSync(pathToDelete) ) {
		rootPath = rootPath || findRoot(process.cwd());

		// if (pathToDelete.indexOf(rootPath) === 0)
		// {
			fs.readdirSync(pathToDelete).forEach(function(file,index){
				var curPath = path.join(pathToDelete, file);
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath, rootPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});

			fs.rmdirSync(pathToDelete);
		// }else
		// {
		// 	throw new Error("cannot delete folder (" +  pathToDelete + ") that is not child of root package (" + rootPath + ")");
		// }

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
