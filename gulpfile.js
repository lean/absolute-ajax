var gulp = require('gulp'),
 uglify = require('gulp-uglify'),
 jshint = require('gulp-jshint'),
 rename = require("gulp-rename"),
 stylish = require('jshint-stylish'),
    watch = require('gulp-watch');

gulp.task('default', function() {
  gulp.src('./src/absolute-ajax.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(gulp.dest('./test/public'))
    .pipe(uglify({
      preserveComments : "some"
    }))
    .pipe(rename("absolute-ajax.min.js"))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
      watch('src/absolute-ajax.js', function (files, cb) {
        gulp.start('default', cb);
    });
});
