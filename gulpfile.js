/*
 * Copyright (c) 2017 OBiBa. All rights reserved.
 *
 * This program and the accompanying materials
 * are made available under the terms of the GNU Public License v3.0.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var streamqueue = require('streamqueue');
var fs = require('fs');

gulp.task('default', ['minify'  ]);

gulp.task('watch', ['minify', 'connect', 'watch']);

gulp.task('connect', function () {
  connect.server({
    root: ['demo', './'],
    port: 8888,
    livereload: true,
  });
});

gulp.task('reload', ['minify'], function () {
  gulp.src('./dist/**/*.*').pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/**', './demo/**'], ['reload']);
});

gulp.task('minify', function () {
  var files = JSON.parse(fs.readFileSync('sources.json', 'utf-8'));
  var stream = streamqueue({ objectMode: true },
    gulp.src(['src/templates/**/*.html']).pipe(templateCache({
      standalone: true,
      root: 'src/templates/',
      module: 'sfLocalizedStringTemplates'
    })),
    gulp.src(files)
  )
  .pipe(concat('sf-localized-string.js'))
  .pipe(gulp.dest('./dist'))
  .pipe(uglify())
  .pipe(rename('sf-localized-string.min.js'))
  .pipe(gulp.dest('./dist'));

  return stream;
});
