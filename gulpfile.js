/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  eslint = require('gulp-eslint'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	del = require('del'),
  env = 'DEV';

// default build doesn't uglify JS
gulp.task('default', function () {
  runBuild();
});

gulp.task('prod', function () {
  env = 'PROD';
  runBuild();
});

function runBuild() {
  runSequence(
    'eslint',
    'clean',
    'build-css',
    'build-js',
    'copyHtml',
    'copyResources'
  );
}

gulp.task('clean', function () {
	return del('target/**/*');
});

gulp.task('eslint', function() {
	return gulp.src(['src/**/*.js','!node_modules/**','!src/js/jquery-3.2.1.min.js'])
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
  var stream = gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init());

  if (env === 'PROD') {
    stream.pipe(uglify().on('error', function(e){
      console.log(e);
    }));
  }

  return stream.pipe(sourcemaps.write())
    .pipe(gulp.dest('target/js'));
});

gulp.task('copyHtml', function() {
  gulp.src('src/*.html').pipe(gulp.dest('target'));
});

gulp.task('copyResources', function() {
  gulp.src('src/resources/**').pipe(gulp.dest('target/resources'));
});
