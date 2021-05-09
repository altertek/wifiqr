const { src, dest, series } = require('gulp');
const staticI18nHtml = require('gulp-static-i18n-html');
const del = require('del');

const clean = () => {
    return del(['dist', 'build']);
}

const copyBaseFiles = () => {
    return src('src/base/*')
        .pipe(dest('./dist'));
}


const copyAssets = () => {
    return src('src/{assets,css,js}/**')
        .pipe(dest('./dist'));
}

const i18n = () => {
  return src('./templates/*.html')
    .pipe(staticI18nHtml({
        localesPath: 'locales',
        locale: null,
        locales: ['en', 'fr']
    }))
    .pipe(dest('./dist'));
}


var sort = require('gulp-sort');
var RevAll = require("gulp-rev-all");

const revision = () => {
    return src("dist/**")
        .pipe(sort())
        .pipe(RevAll.revision({ dontRenameFile: [/^\/favicon.ico$/g, ".html"]}))
        .pipe(dest("build"));
}


// exports.build = build;
exports.default = series(clean, copyBaseFiles, copyAssets, i18n, revision);
