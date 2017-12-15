/* File: gulpfile.js */

// grab our gulp packages
const gulp = require('gulp'),
  runSequence = require('run-sequence'),
  eslint     = require('gulp-eslint'),
	sass       = require('gulp-sass'),
  uglify     = require('gulp-uglify'),
	del        = require('del'),
  babelify   = require('babelify'),
  browserify = require('browserify'),
  buffer     = require('vinyl-buffer'),
  coffeeify  = require('coffeeify'),
  gutil      = require('gulp-util'),
  livereload = require('gulp-livereload'),
  merge      = require('merge'),
  rename     = require('gulp-rename'),
  source     = require('vinyl-source-stream'),
  sourceMaps = require('gulp-sourcemaps'),
  vinylMap   = require('vinyl-map'),
  watchify   = require('watchify');

let env = 'PROD',
  config = {
    js: {
        src: './src/js/main.js',       // Entry point
        outputDir: './target/js/',  // Directory to save bundle to
        mapDir: './maps/',      // Subdirectory to save maps to
        outputFile: 'bundle.js' // Name to use for bundle
    },
  };

// default build doesn't uglify JS
gulp.task('default', function () {
  runBuild();
});

gulp.task('dev', function () {
  env = 'DEV';
  runBuild();
});

function runBuild() {
  runSequence(
    'eslint',
    'clean',
    'build-css',
    'bundle',
    'copyHtml',
    'copyResources'
  );
}

gulp.task('clean', function () {
	return del('target/**/*');
});

gulp.task('eslint', function() {
	return gulp.src(['src/**/*.js','!node_modules/**','!src/test/**'])
			.pipe(eslint())
			// eslint.format() outputs the lint results to the console.
			// Alternatively use eslint.formatEach() (see Docs).
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());
});

gulp.task('build-css', function() {
  return gulp.src('src/scss/**/*.scss')
	.pipe(sourceMaps.init())  // Process the original sources
	.pipe(sass())
	.pipe(sourceMaps.write()) // Add the map to modified source.
  .pipe(gulp.dest('target/stylesheets'));
});

gulp.task('copyHtml', function() {
  gulp.src('src/*.html').pipe(gulp.dest('target'));
  gulp.src('src/*.xml').pipe(gulp.dest('target'));
});

gulp.task('copyResources', function() {
  gulp.src('src/resources/**').pipe(gulp.dest('target/resources'));
});

// This method makes it easy to use common bundling options in different tasks
function bundle (bundler, includeSourceMaps) {

    // Add options to add to "base" bundler passed as parameter
    bundler = bundler
      .bundle()                             // Start bundle
      .pipe(source(config.js.src))          // Entry point
      .pipe(buffer())                       // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile)); // Rename output

    if (includeSourceMaps) {
      bundler = bundler.pipe(sourceMaps.init({ loadMaps : true }))
      .pipe(sourceMaps.write(config.js.mapDir));      // Save source maps to their own directory
    }

    bundler.pipe(gulp.dest(config.js.outputDir))
      .pipe(livereload());       // reload browser if relevant
}

gulp.task('bundle', function () {
    var bundler = browserify(config.js.src)
                                .transform(coffeeify)
                                .transform(babelify, { presets : [ 'es2015' ] });

    if (env === 'PROD') {
      bundle(bundler, false);
    } else {
      bundle(bundler, true);
    }
});

gulp.task('devProperties', function () {
  gulp.src("./target/js/bundle.js", {"base": "./target/js"})
      .pipe(vinylMap((contents, filename) => {
        return contents.toString().replace("https://app.thistroll.com", "http://localhost:8081");
      }))
      .pipe(gulp.dest("./target/js"));

  // Recaptcha Test Site Key
  gulp.src("./target/index.html", {"base": "./target"})
      .pipe(vinylMap((contents, filename) => {
        return contents.toString()
          .replace("6LehNz0UAAAAAOp_-cYfRbAbjMBJEtLX3Dzgx38O", "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI");
      }))
      .pipe(gulp.dest("./target"));
});
