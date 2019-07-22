var gulp = require('gulp');
var coffee = require('gulp-coffee');
var mocha = require('gulp-mocha');
var requireIndex = require('gulp-require-index');

gulp.task('coffee', function() {
  return gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('buildIndex', function () {
  return gulp.src(['./lib/**/*.js','!./lib/wiring.js'])
    .pipe(requireIndex({name:'wiring.js'}))
    .pipe(gulp.dest('./lib'));
});

gulp.task('coffeeTest', function() {
  return gulp.src('./test/src/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./test/'));
});

var build;
gulp.task('build', build = gulp.series('coffee', 'buildIndex', function (done) {
    console.log('Build Complete');
    done();
}));

gulp.task('test', gulp.series('build','coffeeTest', function() {
  return gulp.src('./test/tests.js')
    .pipe(mocha());
}));

gulp.task('default', build);