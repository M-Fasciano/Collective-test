var gulp = require('gulp'),
    ext = require('gulp-ext'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs'),
    path = require('path'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    wait = require('gulp-wait');

//handlebars task dependencies
var handlebars = require('gulp-hb'),
    handlebarsLayouts = require('handlebars-layouts'),
    frontMatter = require('gulp-front-matter');

//styles task dependencies
var sass = require('gulp-sass');

//scripts task dependencies
var browserify = require('gulp-browserify'),
    browserifyHandlebars = require('browserify-handlebars');

//server task dependencies
var connect = require('gulp-connect')
    open = require('gulp-open');

//iconfont task dependencies
var consolidate = require('gulp-consolidate'),
    args = require('yargs').argv,
    iconfont = require('gulp-iconfont');

var config = {
    source: 'source/',
    output: 'dist/'
}

gulp.task('build', ['handlebars','styles','scripts','copy']);

gulp.task('dev', ['handlebars','styles','scripts','copy']);

gulp.task('default', ['dev', 'server','watch']);

gulp.task('handlebars', function() {

    return gulp.src(config.source + 'html/pages/**/*.{hbs,handlebars}')
        .pipe(frontMatter({
            property: 'data',
            remove: true
        }))
        .pipe(handlebars({
                helpers: handlebarsLayouts,
                data: config.source + 'html/data/**/*.{json,yaml}'
            })
            .partials(config.source + 'html/partials/**/*.{hbs,handlebars}')
            .partials(config.source + 'html/layouts/**/*.{hbs,handlebars}')
        )
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(ext.replace('html'))
        .pipe(gulp.dest(config.output))
        .pipe(connect.reload());

});

gulp.task('styles', function() {

    return gulp.src(config.source + 'css/core.scss')
        .pipe(wait(1500))
        .pipe(sass())
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'css/'))
        .pipe(connect.reload());

});

gulp.task('scripts', function() {

    return gulp.src(config.source + 'js/main.js')
        .pipe(browserify({
                transform: [browserifyHandlebars]
            }))
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'js/'))
        .pipe(connect.reload());

});

gulp.task('copy', function() {

    return gulp.src([
            config.source + 'images/**/*.*',
            config.source + 'content-images/**/*.*'
        ])
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'images/'))
        .pipe(connect.reload());

});

gulp.task('fonts', function() {

    return gulp.src([
            config.source + 'fonts/**'
        ])
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(gulp.dest(config.output + 'fonts/'))
        .pipe(connect.reload());

});

gulp.task('connect', function() {

    return connect.server({
        root: config.output,
        port: 9012,
        livereload: true
    })

});

gulp.task('server', ['connect'], function() {
    return gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:9012'
        }))

});

gulp.task('watch', function() {
    //HTML watch
    gulp.watch([
            config.source + 'html/**/*',
            '!' + config.source + 'html/partials/fileList.handlebars'
        ],
        ['handlebars']
    ).on('change', function(file) {
        watchMessage("HTML", file);
    })
    //Images watch
    gulp.watch([
            config.source + 'images/**/*',
            config.source + 'content-images/**/*.*'
        ],
        ['copy']
    ).on('change', function(file) {
        watchMessage("images", file);
    })
    //CSS watch
    gulp.watch(
        config.source + 'css/**/*',
        ['styles']
    ).on('change', function(file) {
        watchMessage("CSS", file);
    })
    //JS watch
    gulp.watch(
        config.source + 'js/**/*',
        ['scripts']
    ).on('change', function(file) {
        watchMessage("JS", file);
    })
});

function watchMessage(taskname, file) {
    return gutil.log(
        "File: ",
        gutil.colors.green(file.path),
        gutil.colors.cyan("caused " + taskname + " watch to run")
    );
}