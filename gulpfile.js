import {src, dest, watch, series, parallel} from 'gulp';
import {deleteAsync} from 'del';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import atImport from 'postcss-import';
import concat from 'gulp-concat';
import imagemin, {mozjpeg, optipng, svgo} from 'gulp-imagemin';

// Clean
export const clean = () => deleteAsync([ 'assets' ]);

// Styles
export function styles() {
  return src('front-end-boilerplate/src/css/main.css', {encoding: false})
    .pipe(postcss([atImport, cssnano()]))
    .pipe(concat('styles.css.liquid'))
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

export function modules() {
  return src('node_modules/yett/dist/yett.min.modern.js', {encoding: false})
    .pipe(dest('assets/'));
}

function watchFiles() {
  watch('src/styles/**/*', styles);
  watch('src/images/*', images);
}

const build = series(clean, parallel(modules, images, styles), watchFiles);

export default build;
