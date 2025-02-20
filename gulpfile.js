import gulp from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import browserSync from 'browser-sync';
import postcss from 'gulp-postcss';
import beautify from 'gulp-cssbeautify';
import minify from 'gulp-csso';
import autoprefixer from 'gulp-autoprefixer';

const sassCompiler = gulpSass(sass);

const PATH = {
    BUILD_FOLDER: './dist/',
    SCSS_FOLDER: './src/scss/*.scss',
    CSS_OUTPUT: './dist/css/',
    CSS_AUTOPREFIXER: './dist/cssautoprefixer/',
    STYLES_FILE: './dist/css/styles.css',
    CSS_BEAUTUFY_FOLDER: './dist/cssbeautify/',
    CSS_MINIFY_FOLDER: './dist/cssminify/'
}

gulp.task('default', gulp.series(scssTask, autoprefix, cssBeautify, minifyFunction, gulp.parallel(watchFiles)));

// ./dist/css/styles.css 
// #1 Робота з препроцесором SCSS: 
// Компіляція файлів SCSS у CSS, 
// забезпечуючи більш гнучкий та ефективний процес створення стилів.
async function scssTask() {
    return gulp.src(PATH.SCSS_FOLDER)
        .pipe(sassCompiler())
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
}

// ./dist/cssautoprefixer
// #3 Вендорні префікси: Автоматичне додавання вендорних префіксів до CSS властивостей, 
// забезпечуючи кращу сумісність з різними браузерами.
async function autoprefix() {
    return gulp.src(PATH.STYLES_FILE)
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest(PATH.CSS_AUTOPREFIXER));
}

// ./dist/cssbeautify/
// #4 Стайлінг кінцевого та базового коду: 
// Покращення читабельності CSS коду через форматування та оптимізацію структури.

async function cssBeautify() {
    return gulp.src(PATH.STYLES_FILE)
        .pipe(beautify())
        .pipe(gulp.dest(PATH.CSS_BEAUTUFY_FOLDER))
}


// ./dist/cssminify/
// #5 Мінімізація стилів: 
// Зменшення розміру CSS файлів через видалення зайвих пробілів, 
// коментарів тощо, 
// що сприяє швидшому завантаженню сторінки.

async function minifyFunction() {
    return gulp.src(PATH.STYLES_FILE)
        .pipe(minify())
        .pipe(gulp.dest(PATH.CSS_MINIFY_FOLDER))
}