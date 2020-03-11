const browserify = require('browserify');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const babel = require('gulp-babel');
const filter = require('gulp-filter');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');

const pkg = require('./package.json');

/**
 * Generate a preamble for the file header of the distributed script.
 *
 * @param {Objet} pkg The package information of a module.
 * @param {string} [separator=' '] A separator to add between each item.
 * @return {string}
 */
function preamble(pack, separator) {
  const repo = `https://github.com/${pack.repository}`;
  const license = `@license ${pack.license}`;
  const items = [
    pack.name,
    pack.version,
    repo,
    license,
  ];

  return items.join(separator || ' ');
}

// Remove previous versions of the current package.
gulp.task('clean', function () {
  return del(['dist']);
});

// Generate a version of the package that can be used in a browser context.
gulp.task('build', function () {
  return browserify({
    entries: './index.js',
    debug: true,
    standalone: 'markdownitAttribution',
  })
    .bundle()
    .pipe(source('index.js'))
    .pipe(babel())
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename({ basename: pkg.name }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(filter('**/*.js'))
    .pipe(uglify({
      output: {
        beautify: false,
        preamble: `/*! ${preamble(pkg)} */`,
      },
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

// (Re-)generate the distributed bundle by default.
gulp.task('default', gulp.series('clean', 'build'));
