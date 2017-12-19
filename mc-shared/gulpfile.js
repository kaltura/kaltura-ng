'use strict';

var gulp = require('gulp');

// load plugins
var $ = require('gulp-load-plugins')();
var tslint = require("gulp-tslint");
var del = require('del');
var runSequence = require('run-sequence');
var jeditor = require("gulp-json-editor");
const ngc = require('gulp-ngc') ;
const sass = require('gulp-sass') ;
var path = require('path');
var through = require('through2');
var createNpmPackageJson = require('../scripts/create-npm-package-json');
var inlineResources = require('../scripts/ng-inline-resources');

var merge = require('merge2');  // Require separate installation
//var KarmaServer = require('karma').Server;

//set configuration
const tsconfig = require('./tsconfig.json').compilerOptions;

const tempDist = './.tmp';
const dist = './dist';

// clean the contents of the distribution directory
gulp.task('clean', ['clean:tmp','clean:dist']);

gulp.task('clean:tmp', function () {
	return del([tempDist], {force: true});
});

gulp.task('clean:dist', function () {
	return del([`${dist}/**/*`], {force: true});
});

gulp.task('library:scripts', function () {
	return ngc('tsconfig.json');
});

gulp.task('library:view', function () {
	var sassFiles = gulp.src(['./src/**/*.scss', '!.src/scripts/**/*'],{base : './src/'})
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(through.obj(function(file, enc, cb) {

			if (file) {
				//change the .css extension back to .scss (which is what 'inlineResources' script will expect it to be)
				var nFileName = path.basename(file.path, path.extname(file.path)) + '.scss';
				file.path = path.join(path.dirname(file.path), nFileName);
				return cb(null, file);

				return cb(null,file);
			}

			return cb();

		}));
	var htmlFiles = gulp.src(['./src/**/*.html', '!.src/scripts/**/*'],{base : './src/'});

	return merge([
		sassFiles,
		htmlFiles
	]).pipe(gulp.dest(tempDist)).on('end', function()
	{
		return inlineResources(tempDist);
	});
});

gulp.task('extras', function () {
	var packageFileResult = gulp.src(['package.json'], {base: './'})
		.pipe(through.obj(function (file, enc, cb) {
			if (file)
			{
				const packageFileContent = file.contents.toString('utf8');
				const npmPackageFileContent = createNpmPackageJson(packageFileContent);
				file.contents = new Buffer(npmPackageFileContent);
			}
			cb(null, file)
		}))
		.pipe(gulp.dest(tempDist));


	var stylesResult = gulp.src(['./src/styles/**/*'], {base: './src/'}).pipe(gulp.dest(tempDist));
	var licenseFileResult = gulp.src(['../LICENSE.txt'], {base: '../'}).pipe(gulp.dest(tempDist));
	var readmeFileResult = gulp.src(['./README.md'], {base: './'}).pipe(gulp.dest(tempDist));

	return merge([
		licenseFileResult,
		stylesResult,
		packageFileResult,
		readmeFileResult
	])
});

gulp.task('copyTmpToDist', ['clean:dist'], function () {
	return gulp.src([`./${tempDist}/**/*`, `./${tempDist}/**/.*`], {base: tempDist}).pipe(gulp.dest(dist));
});

gulp.task('build',function () {

	return runSequence('clean:tmp','library:scripts','library:view','extras','copyTmpToDist','clean:tmp');
});

gulp.task('watch', [], function () {

	runSequence(
		'clean:tmp',
		'build',
		function()
		{
			gulp.watch([
				'./src/**/*',
				'!./src/**/*.spec.ts'
			],debounced('build',3000)).on('change', function (event) {
				console.log('File ' + event.path + ' was ' + event.type);
			});
		}
	)

});

function debounced (task, interval) {
	var rerun = false;
	var running = false;
	var timeout = null;
	console.log(`debounced created with ${interval} timeout dealy`);
	return function debounced () {

		if (!running) {
			rerun = false;

			if (timeout)
			{
				clearTimeout(timeout);
				timeout = null;
			}

			timeout = setTimeout(function () {
				running = true;
				console.log(`Running task '${task}'`);
				timeout = null;
				gulp.start(task,function debounceCallback () {
					running = false;
					if (rerun) {
						console.log(`Another change(s) detected, Re-running task '${task}'`);
						rerun = false;
						gulp.start(task);
					}
				});
			}, interval);
		} else {
			rerun = true;
		}
	};
}