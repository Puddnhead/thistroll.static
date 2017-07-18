/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  eslint = require('gulp-eslint'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	del = require('del');

// define the default task and add the watch task to it
gulp.task('default', function () {
	runSequence(
		'eslint',
		'clean',
		'build-css',
		'build-js',
		'copyHtml',
		'copyResources'
	);
});

gulp.task('clean', function () {
	return del('target/**/*');
});

gulp.task('eslint', function() {
	return gulp.src(['src/**/*.js','!node_modules/**'])
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
});

gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
	.pipe(sourcemaps.init())  // Process the original sources
	.pipe(sass())
	.pipe(sourcemaps.write()) // Add the map to modified source.
  .pipe(gulp.dest('target/stylesheets'));
});

gulp.task('build-js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('target/js'));
});

gulp.task('copyHtml', function() {
  gulp.src('src/*.html').pipe(gulp.dest('target'));
});

gulp.task('copyResources', function() {
  gulp.src('src/resources/**').pipe(gulp.dest('target/resources'));
});
