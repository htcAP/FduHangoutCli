var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var watch = require('gulp-watch');
var shell = require('gulp-shell');

var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['./www/js/**/*.js']
};

gulp.task('default', ['sass', 'index']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('index', function(){
  return gulp.src('./www/index.html')
    .pipe(inject(gulp.src('./www/js/**/*.js', {read: false}), {relative: true}))
    .pipe(gulp.dest('./www'));
});


gulp.task('reload-plugin', shell.task([
  'ionic plugin remove plugin-leyi',
  'ionic plugin add ./plugin-leyi'
]));

gulp.task('watch', function() {
  gulp.start('default');

  gulp.src(paths.sass)
    .pipe(watch(paths.sass, function() {
      gulp.start('sass');
    }));
  gulp.src(paths.js)
    .pipe(watch(paths.js, function() {
      gulp.start('index');
    }));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});


gulp.task('prepare-android', function() {
  gulp.src('./keys/*.properties')
    .pipe(gulp.dest('./platforms/android'));
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
