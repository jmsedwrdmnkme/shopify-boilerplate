import {src, dest, watch, series, parallel} from 'gulp';
import {deleteAsync} from 'del';
import concat from 'gulp-concat';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import cssnano from 'cssnano';
import compiler from 'webpack';
import webpack from 'webpack-stream';

import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';

// Clean
export const clean = () => deleteAsync('assets');

// Styles
export function styles() {
  return src('src/styles/main.scss', {encoding: false})
    .pipe(sass({style: 'compressed'}).on('error', sass.logError))
    .pipe(concat('main.css.liquid'))
    .pipe(dest('assets/'));
}

// Scripts
export function scripts() {
  return src('src/scripts/main.js', {encoding: false})
    .pipe(webpack({}, compiler, function(err, stats) {}))
    .pipe(concat('main.js'))
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

export function fonts() {
  return src('src/fonts/*', {encoding: false})
    .pipe(dest('assets/'));
}

function watchFiles() {
  watch('src/styles/**/*', styles);
  watch('src/scripts/**/*', scripts);
  watch('src/images/*', images);
  watch('src/fonts/*', fonts);
}

const build = series(clean, parallel(styles, scripts, images, fonts), watchFiles);

export default build;
