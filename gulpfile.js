'use strict'

var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')
var $ = require('gulp-load-plugins')()

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: './app'
  })
  gulp.watch('app/*.html').on('change', browserSync.reload)
  gulp.watch('app/js/*.js').on('change', browserSync.reload)
})

gulp.task('watch:styles', function () {
  return gulp.watch(['app/styles/scss/*.scss', 'app/styles/scss/**/*.scss'], ['sass'])
})

gulp.task('sass', function () {
  return gulp.src('app/styles/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
		.pipe($.plumber())
    .pipe($.sass({outputStyle: 'compressed'}))
		.pipe($.autoprefixer())
    .pipe(gulp.dest('app/styles/css'))
    .pipe(browserSync.stream())
})

gulp.task('default', ['serve', 'watch:styles', 'sass'])
