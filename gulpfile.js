import {src, dest, watch, series, parallel} from 'gulp';
import {deleteAsync} from 'del';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
const sass = gulpSass( dartSass );
import cleanCSS from 'gulp-clean-css';
import compiler from 'webpack';
import webpack from 'webpack-stream';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';

// Clean
export const clean = () => deleteAsync([ 'assets' ]);

// Styles
export function styles() {
  return src('src/styles/*', {encoding: false})
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(cleanCSS())
    .pipe(concat('styles.css.liquid'))
    .pipe(dest('assets/'));
}

// Scripts
export function scripts() {
  return src('src/scripts/*', { encoding: false, sourcemaps: true })
    .pipe(webpack({}, compiler, function(err, stats) {}))
    .pipe(uglify())
    .pipe(concat('scripts.js.liquid'))
    .pipe(dest('assets/'));
}

// Assets
export function images() {
  return src('src/images/*', {encoding: false})
    .pipe(imagemin([
      //gifsicle({interlaced: true}),
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
