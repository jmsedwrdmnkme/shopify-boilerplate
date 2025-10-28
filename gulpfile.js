import {src, dest, watch, series, parallel} from 'gulp';
import {deleteAsync} from 'del';
import concat from 'gulp-concat';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import uglify from 'gulp-uglify';
import compiler from 'webpack';
import strip from 'gulp-strip-comments';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import webpack from 'webpack-stream';
import fs from 'file-system';
import path from 'path';
import fileinclude from 'gulp-file-include';


// Clean
export const clean = () => deleteAsync(['assets', 'sections']);

// Styles
export function styles() {
  return src('src/styles/main.scss', {encoding: false})
    .pipe(sass({
      silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import'],
      style: 'compressed'
    }).on('error', sass.logError))
    .pipe(concat('main.css.liquid'))
    .pipe(dest('assets/'));
}

// Assets
export function images() {
  return src('src/images/*', {encoding: false})
    .pipe(imagemin([
      gifsicle({interlaced: true}),
      mozjpeg({quality: 75, progressive: true}),
      optipng({optimizationLevel: 5}),
      svgo({plugins: [
        {name: 'removeViewBox', active: true},
        {name: 'cleanupIDs', active: true},
        {name: 'collapseGroups', active: true}
      ]})
    ]))
    .pipe(dest('assets/'));
}

// Sections
export function sections() {
  const sectionsArray = fs.readdirSync('src/sections/')
    .filter(function(file) {
      return fs.statSync(path.join('src/sections/', file)).isDirectory();
  });

  return sectionsArray.map(function (section) {
    return series(
      async function sectionDeletePartials () {
        return deleteAsync(`sections/${section}`);
      },

      function sectionStyles () {
        return src(`src/sections/${section}/styles.scss`, {encoding: false})
          .pipe(sass({
            silenceDeprecations: ['legacy-js-api', 'color-functions', 'global-builtin', 'import'],
            style: 'compressed'
          }).on('error', sass.logError))
          .pipe(concat('partials/styles.min.css'))
          .pipe(dest(`src/sections/${section}/`));
      },

      function sectionScripts () {
        return src(`src/sections/${section}/scripts.js`, {encoding: false})
          .pipe(webpack({}, compiler, function(err, stats) {}))
          .pipe(uglify())
          .pipe(strip())
          .pipe(concat('partials/scripts.min.js'))
          .pipe(dest(`src/sections/${section}/`));
      },

      function sectionLiquid () {
        return src(`src/sections/${section}/${section}.liquid`, {encoding: false})
          .pipe(fileinclude({
            prefix: '@@',
            basepath: `src/sections/${section}/partials`
          }))
          .pipe(dest('sections/'));
      },

      async function sectionDeletePartials () {
        return deleteAsync(`src/sections/${section}/partials`);
      },

      function sectionsDone (done) {
        done();
      }
    );
  });
}

// Fonts
export function fonts() {
  return src('src/fonts/*', {encoding: false})
    .pipe(dest('assets/'));
}

// Watch
function watchFiles() {
  watch('src/styles/**/*', styles);
  watch('src/images/*', images);
  watch(['src/sections/**/*.liquid', 'src/sections/**/*.js', 'src/sections/**/*.scss'], sectionsBuild);
  watch('src/fonts/*', fonts);
}

// Tasks
const sectionsBuild = parallel.apply(parallel, sections());
const build = series(clean, parallel(styles, images, fonts), sectionsBuild, watchFiles);

export default build;
