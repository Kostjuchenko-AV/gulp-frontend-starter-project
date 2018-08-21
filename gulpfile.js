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

// Concat
var concat = require('gulp-concat');

// KSS
var kss = require('kss');

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



// Styleguide tasks

gulp.task('clean:styleguide', function() {
	return del.sync('styleguide');
});

gulp.task('sass:styleguide', function() { 
	return gulp.src('./src/sass/**/*.scss')
	.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
	.pipe(sass())
	.pipe(concat('main.css'))
	.pipe(autoprefixer({
		browsers: ['last 4 versions'],
		cascade: false
	}))
	.pipe(gcmq())
	.pipe(gulp.dest('./styleguide/css/'))
});

gulp.task('build:styleguide', ['sass:styleguide'], function() {
	return kss({
		source: './src/sass',
		destination: './styleguide',
		css: 'css/main.css',
		title: 'Gulp frontend starter project Styleguide'
	});
});

gulp.task('dev:styleguide', ['clean:styleguide', 'build:styleguide'], function() {
	browserSync.init({
		server: { baseDir: './styleguide/' }
	});
	gulp.watch('./src/sass/**/*.scss', ['build:styleguide']);
});

gulp.task('prod:styleguide', ['clean:styleguide', 'build:styleguide']);