const gulp = require('gulp');
const sass = require('sass');
const gulpSass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const beautify = require('gulp-cssbeautify');
const minify = require('gulp-csso');

const PATH = {
    BUILD_FOLDER: './dist/',
    JS_FOLDER: './src/js/*.js',
    SCSS_FOLDER: './src/scss/*.scss',
    CSS_OUTPUT: './dist/css/',
    HTML_FILE: './index.html'
}

gulp.task('default', gulp.series(copy, scssTask, cssBeautify, minifyFunction, gulp.parallel(watchFiles)));

async function copy() {
    return gulp.src(PATH.JS_FOLDER)
        .pipe(gulp.dest(PATH.BUILD_FOLDER));
}

// ./dist/css/styles.css for #1
// ./dist/css/styles.css.map for #3
// #1 Робота з препроцесором SCSS: 
// Компіляція файлів SCSS у CSS, 
// забезпечуючи більш гнучкий та ефективний процес створення стилів.
// #3 Вендорні префікси: Автоматичне додавання вендорних префіксів до CSS властивостей, 
// забезпечуючи кращу сумісність з різними браузерами.
async function scssTask() {
    return gulp.src(PATH.SCSS_FOLDER)
        .pipe(sourcemaps.init())
        .pipe(gulpSass().on('error', gulpSass.logError))
        .pipe(postcss([autoprefixer({ cascade: false })]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(PATH.CSS_OUTPUT));
}

// #2 Оновлення сторінки в реальному часі: 
// Автоматичне оновлення веб-сторінки у браузері при зміні коду, 
// що покращує зручність розробки.
async function syncInit() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
}

async function sync() {
    browserSync.reload();
}

async function watchFiles() {
    syncInit();
    gulp.watch(PATH.SCSS_FOLDER, gulp.series(scssTask, sync));
    gulp.watch(PATH.HTML_FILE, sync);
    gulp.watch(PATH.JS_FOLDER, sync);
}

// ./dist/cssbeautify/
// #4 Стайлінг кінцевого та базового коду: 
// Покращення читабельності CSS коду через форматування та оптимізацію структури.

async function cssBeautify() {
    return gulp.src('./dist/css/styles.css')
        .pipe(beautify())
        .pipe(gulp.dest('./dist/cssbeautify/'))
}


// ./dist/cssminify/
// #5 Мінімізація стилів: 
// Зменшення розміру CSS файлів через видалення зайвих пробілів, 
// коментарів тощо, 
// що сприяє швидшому завантаженню сторінки.

async function minifyFunction() {
    return gulp.src('./dist/css/styles.css')
        .pipe(minify())
        .pipe(gulp.dest('./dist/cssminify/'))
}