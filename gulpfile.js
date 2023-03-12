import gulp from 'gulp';
import staticI18nHtml from 'gulp-static-i18n-html';
import {deleteAsync} from 'del';
import sort from 'gulp-sort'
import RevAll from 'gulp-rev-all'

export function clean() {
    return deleteAsync(['dist', 'build']);
}

export function copyBaseFiles() {
    return gulp.src('src/base/*')
        .pipe(gulp.dest('./dist'));
}


export function copyAssets() {
    return gulp.src('src/{assets,css,js}/**')
        .pipe(gulp.dest('./dist'));
}

export function i18n() {
  return gulp.src('./templates/*.html')
    .pipe(staticI18nHtml({
        localesPath: 'locales',
        locale: null,
        locales: ['en', 'fr']
    }))
    .pipe(gulp.dest('./dist'));
}

export function revision() {
    return gulp.src("dist/**")
        .pipe(sort())
        .pipe(RevAll.revision({ dontRenameFile: [/^\/favicon.ico$/g, ".html"]}))
        .pipe(gulp.dest("build"));
}

const build = gulp.series(clean, copyBaseFiles, copyAssets, i18n, revision)

/*
 * Export a default task
 */
export default build;
