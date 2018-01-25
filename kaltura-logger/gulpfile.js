'use strict';

var gulp = require('gulp');

// load plugins
var runSequence = require('run-sequence');
var through = require('through2');
var createNpmPackageJson = require('../scripts/create-npm-package-json');

const sass = require('node-sass');
const inlineTemplates = require('gulp-inline-ng2-template');
const exec = require('child_process').exec;
var merge = require('merge2');  // Require separate installation

const tempDist = './tmp';
const outDir = './dist';
/**
 * Inline templates configuration.
 * @see  https://github.com/ludohenin/gulp-inline-ng2-template
 */
const INLINE_TEMPLATES = {
  SRC: './src/**/*.ts',
  DIST: tempDist + '/src-inlined',
  CONFIG: {
    base: '/src',
    target: 'es6',
    useRelativePaths: true,
    styleProcessor: compileSass
  }
};

/**
 * Inline external HTML and SCSS templates into Angular component files.
 * @see: https://github.com/ludohenin/gulp-inline-ng2-template
 */
gulp.task('inline-templates', () => {
  return gulp.src(INLINE_TEMPLATES.SRC)
    .pipe(inlineTemplates(INLINE_TEMPLATES.CONFIG))
    .pipe(gulp.dest(INLINE_TEMPLATES.DIST));
});

gulp.task('clean:tmp',(callback) =>
{
  exec('npm run clean:tmp', function (cleanError) {
    callback()
  });
});

/**
 * Build ESM by running npm task.
 * This is a temporary solution until ngc is supported --watch mode.
 * @see: https://github.com/angular/angular/issues/12867
 */
gulp.task('build:esm', ['inline-templates'], (callback) => {
  exec('npm run ngcompile', function (error, stdout, stderr) {
    console.log(stdout, stderr);

    if (error)
    {
      runSequence('clean:tmp',() =>
      {
        callback();
    });
    }else {
      runSequence('extras','clean:tmp',() =>
      {
        callback();
      });
    }
  });
});

/**
 * Implements ESM build watch mode.
 * This is a temporary solution until ngc is supported --watch mode.
 * @see: https://github.com/angular/angular/issues/12867
 */
gulp.task('build:esm:watch', ['build:esm'], () => {
  gulp.watch('src/**/*', ['build:esm']);
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
    .pipe(gulp.dest(outDir));


  var stylesResult = gulp.src(['./src/styles/**/*'], {base: './src/'}).pipe(gulp.dest(outDir));
  var licenseFileResult = gulp.src(['../LICENSE.txt'], {base: '../'}).pipe(gulp.dest(outDir));
  var readmeFileResult = gulp.src(['./README.md'], {base: './'}).pipe(gulp.dest(outDir));

  return merge([
    licenseFileResult,
    stylesResult,
    packageFileResult,
    readmeFileResult
  ])
});

/**
 * Compile SASS to CSS.
 * @see https://github.com/ludohenin/gulp-inline-ng2-template
 * @see https://github.com/sass/node-sass
 */
function compileSass(path, ext, file, callback) {
  let compiledCss = sass.renderSync({
    file: path,
    outputStyle: 'compressed',
  });
  callback(null, compiledCss.css);
}
