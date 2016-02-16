/**
 * Created by MrSingh on 2/13/16.
 */

'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');


gulp.task('style', function(){

    var jsFiles = ['public/js/**/*.js'];

    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish',{
            verbose:true
        }))
});

gulp.task('inject', function(){
    var wiredep = require('wiredep').stream;
    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/bower-components/'
    };


    return gulp.src('./public/index.html')
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(['./public/js/**/*.js', './public/css/**/*.css'], {read: false}), {ignorePath: '/public'}))
        .pipe(gulp.dest('./public'))

});