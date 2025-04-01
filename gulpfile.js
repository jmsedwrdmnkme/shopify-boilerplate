import {src, dest, watch, series, parallel} from 'gulp';
import {deleteAsync} from 'del';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import atImport from 'postcss-import';
import concat from 'gulp-concat';
import compiler from 'webpack';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';

// Clean
export const clean = () => deleteAsync([ 'assets' ]);

// Styles
export function styles() {
  return src(['front-end-boilerplate/src/css/main.css', 'src/styles/*'], {encoding: false})
    .pipe(postcss([
      atImport,
      cssnano({
        preset: ["default", { discardComments: { removeAll: true } }]
      })
    ]))
    .pipe(concat('styles.css.liquid'))
    .pipe(dest('assets/'));
}

// Scripts
export function scripts() {
  return src(['front-end-boilerplate/src/js/main.js', 'src/scripts/*'], {encoding: false})
    .pipe(webpack({}, compiler, function() {}))
    .pipe(uglify())
    .pipe(concat('scripts.js.liquid'))
    .pipe(dest('assets'));
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

function watchFiles() {
  watch('src/styles/**/*', styles);
  watch('src/scripts/**/*', scripts);
  watch('src/images/*', images);
}

const build = series(clean, parallel(images, styles, scripts), watchFiles);

export default build;
