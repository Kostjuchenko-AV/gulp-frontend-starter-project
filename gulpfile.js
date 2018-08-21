// Gulp
var gulp = require('gulp');

// Plumber
var plumber = require('gulp-plumber');

// Notify
var notify = require("gulp-notify");

// BrowserSync
var browserSync = require('browser-sync');

// Pug
var pug = require('gulp-pug');

// Sass
var sass = require('gulp-sass');

// Group media queries
var gcmq = require('gulp-group-css-media-queries');

// Autoprefixer
var autoprefixer = require('gulp-autoprefixer');

// Imagemin
var imagemin = require('gulp-imagemin');

// Pngquant
var pngquant = require('imagemin-pngquant');

// Delete
var del = require('del');

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('sass', function() { 
	return gulp.src('./src/sass/**/*.scss')
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sass())
	.pipe(autoprefixer({
		browsers: ['last 4 versions'],
		cascade: false
	}))
	.pipe(gcmq())
	.pipe(gulp.dest('./dist/css/'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('pug', function() {
	return gulp.src('./src/pug/*.pug')
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('./dist'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('images', function() {
	return gulp.src('./src/images/**/*')
	.pipe(imagemin({ 
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('./dist/images'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src('./src/js/**/*')      
	.pipe(gulp.dest('./dist/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('build', ['sass', 'pug', 'images', 'js']);

gulp.task('dev', ['clean', 'build'], function() {
	browserSync.init({
		server: { baseDir: './dist/' }
	});
	gulp.watch('./src/sass/**/*.scss', ['sass']);
	gulp.watch('./src/pug/**/*.pug', ['pug']);
	gulp.watch('./src/images/**/*', ['images']);
	gulp.watch('./src/js/**/*.js', ['js']);
});

gulp.task('prod', ['clean', 'build']);
gulp.task('default', ['clean', 'build']);
