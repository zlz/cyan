var gulp = require('gulp'),
    fs = require('fs'),
    del = require('del'),
    path = require('path'),
    gulpChanged = require('gulp-changed'),
    gulpCsso = require('gulp-csso'),
    gulpScss = require('gulp-sass'),
    gulpAutoprefixer = require('gulp-autoprefixer'),
    gulpRename = require('gulp-rename'),
    gulpBabel = require('gulp-babel'),
    paths = {
        src: {
            css: './src/*.css',
            scss: './src/*.scss',
            js: './src/*.js',
        },
        dest: {
            css: './dist/css',
            js: './dist/js'
        }
    };
gulp.task('clean', function () {
    return del(paths.dest);
});
gulp.task('scss', function () {
    return gulp.src(paths.src.scss)
        .pipe(gulpChanged(paths.dest.css, {
            extension: '.min.css'
        })).on('data', function (file) {
            console.log(file.path);
        }).pipe(gulpScss({
            outputStyle: 'expanded'
        }).on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        })).pipe(gulpCsso()).pipe(gulpAutoprefixer('last 2 version', 'safari5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4')).on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        }).pipe(gulpRename({
            suffix: '.min'
        })).pipe(gulp.dest(paths.dest.css));
});
gulp.task('css', function () {
    return gulp.src(paths.src.css)
        .pipe(gulpChanged(paths.dest.css, {
            extension: '.min.css'
        })).on('data', function (file) {
            console.log(file.path);
        }).pipe(gulpCsso()).pipe(gulpAutoprefixer('last 2 version', 'safari5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4')).on('error', function (err) {
            console.log(err.message);
            this.emit('end');
        }).pipe(gulpRename({
            suffix: '.min'
        })).pipe(gulp.dest(paths.dest.css));
});
gulp.task('js', function () {
    return gulp.src(paths.src.js).pipe(gulpChanged(paths.dest.js, {
        extension: '.min.js'
    })).on('data', function (file) {
        console.log(file.path);
    }).pipe(gulpBabel({
        presets: ['es2015'],
        compact: true,
        comments: false,
    })).on('error', function (err) {
        console.log(err.fileName, err.lineNumber, err.message);
        this.emit('end');
    }).pipe(gulpRename({
        suffix: '.min'
    })).pipe(gulp.dest(paths.dest.js));
});
gulp.task('watch', function () {
    gulp.watch(paths.src.css, ['css']);
    gulp.watch(paths.src.scss, ['css']);
    gulp.watch(paths.src.js, ['js']);
});
gulp.task('default', function () {
    gulp.start(['css', 'scss', 'js', 'watch']);
});