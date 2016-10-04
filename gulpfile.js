const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
var batch = require('gulp-batch');

var browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    stringify = require('stringify'),
    fs = require("fs"),
    watch = require('gulp-watch');

gulp.task('default', function() {
  return browserify({ 'entries': ['src/simulator.js'], 'debug' : true })
    .transform(stringify, {
        appliesTo: { includeExtensions: ['.vs', '.fs', '.glsl'] },
        minify: true
    })
    .transform("babelify", {presets: ["es2015"]})
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('dist'));
});
