"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var htmlreplace = require('gulp-html-replace');

gulp.task("concatScripts", function() {
    return gulp.src([
        'assets/js/vendor/jquery.min.js',
        'assets/js/vendor/popper.min.js',
        'assets/js/vendor/bootstrap.min.js',
        'assets/js/vendor/jquery-easing/jquery.easing.min.js',
        'assets/js/functions.js',
        'assets/js/vendor/jquery.slides/jquery.slides.min.js',
		'assets/js/vendor/lightbox/lightbox-plus-jquery.min.js,'
		'assets/js/vendor/lightbox/lightbox.min.js,'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('assets/js'));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
    return gulp.src("assets/js/main.js")
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('compileSass', function() {
    return gulp.src("assets/css/main.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
    return gulp.src("assets/css/main.css")
      .pipe(cssmin())
      .pipe(rename('main.min.css'))
      .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchFiles', function() {
    gulp.watch('assets/css/**/*.scss', ['compileSass']);
    gulp.watch('assets/js/*.js', ['concatScripts']);
})

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('clean', function() {
    del(['dist', 'assets/css/main.css*', 'assets/js/main*.js*']);
});

gulp.task('renameSources', function() {
    return gulp.src('index.html')
        .pipe(htmlreplace({
            'js': 'assets/js/main.min.js',
            'css': 'assets/css/main.min.css'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task("build", ['minifyScripts', 'minifyCss'], function() {
    return gulp.src(['index.html', 'favicon.ico',
            "assets/img/**", "assets/fonts/**"], { base: './'})
            .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
    browserSync.init({
        server: "./"
    });

    gulp.watch("assets/css/**/*.scss", ['watchFiles']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function() {
    gulp.start('renameSources');
});
