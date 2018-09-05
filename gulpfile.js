var gulp = require('gulp');
var coffee = require('gulp-coffee');
var mocha = require('gulp-mocha');
var wrapper = require('spark-wrapper');

gulp.task('coffee', function() {
  return gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(wrapper({namespace:'Parallelio'}))
    .pipe(wrapper.loader({namespace:'Parallelio','filename':'wiring'}))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('coffeeTest', function() {
  return gulp.src('./test/src/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('./test/'));
});

var build;
gulp.task('build', build = gulp.series('coffee', function (done) {
    console.log('Build Complete');
    done();
}));

gulp.task('test', gulp.series('coffee','coffeeTest', function() {
  return gulp.src('./test/tests.js')
    .pipe(mocha());
}));

gulp.task('default', build);