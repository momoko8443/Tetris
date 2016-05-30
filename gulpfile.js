var gulp = require('gulp');
var karma = require('karma');
var connect = require('gulp-connect');
var webpack = require('gulp-webpack');
var sequence = require('gulp-sequence');

gulp.task('webpack', function () {
    return gulp.src('src/core/Game.ts')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/'));
});

gulp.task('test', function (done) {
    var Server = karma.Server;
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('copy', function () {
    // Copy sound
    gulp.src(['asset/sound/*.mp3'])
        .pipe(gulp.dest('dist/asset/sound/'));
});

gulp.task('package', sequence('test', 'webpack'));

gulp.task('connect', ['package'], function () {
    connect.server({
        root: './',
        livereload: true
    });
});