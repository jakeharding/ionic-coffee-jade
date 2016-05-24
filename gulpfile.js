var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var coffeelint = require("gulp-coffeelint");
var coffee = require("gulp-coffee");
var ugly = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");

var paths = {
  sass: ['./scss/**/*.scss'],
  coffee: ['./coffee/*.coffee', './coffee/**/*.coffee'],
  coffee_dest: './js/',
  js_min: "./www/js/",
  app_file: "app.min.js"
};

gulp.task('default', ['coffee', 'sass', 'watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

//Ionic serve
gulp.task('serve', function () {
  sh.exec('ionic serve')
});

// Coffeescript tasks
gulp.task('coffee_lint', function() {
    gulp.src(paths.coffee)
        .pipe(coffeelint())
        .pipe(coffeelint.reporter())
});

gulp.task('coffee_compile', ['coffee_lint'], function () {
    gulp.src(paths.coffee)
        .pipe(coffee())
        .pipe(gulp.dest(paths.coffee_dest));
});

gulp.task('coffee_min', ['coffee_compile'], function () {
    gulp.src(paths.coffee_dest+"*.js")
        .pipe(ugly())
        .pipe(concat(paths.app_file))
        .pipe(gulp.dest(paths.js_min))
});

gulp.task('coffee', ['coffee_min'], function () {
  gulp.src(paths.coffee_dest+"*.js")
    .pipe(sourcemaps.init())
      .pipe(ugly())
      .pipe(concat(paths.app_file))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.js_min))

});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.coffee, ['coffee']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
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
