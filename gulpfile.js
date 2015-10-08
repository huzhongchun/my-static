var path = require( 'path' ),
    gulp = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    jshint = require( 'gulp-jshint' ),      
    csslint = require( 'gulp-csslint' ),
    notify = require( 'gulp-notify' ),
    mapstream = require( 'map-stream' ),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    options = require( './conf/conf.json' ),
    csslintrc = require( './conf/csslintrc.json' ),
    jshintrc = require( './conf/jshintrc.json' ),

    colors = gutil.colors;

// 自定义jshint错误报告
var jshintReporter = mapstream(function( file, callback ){
    var currentJshint = file.jshint;

    if( !currentJshint.success ){
        console.log( '\n' );
        console.log( colors.red('[' + currentJshint.results.length + '] errors in ' + file.path) );

        currentJshint.results.forEach(function( result ){
            var error = result.error;

            console.log( colors.grey('------------------------------------------------------------------------------') );
            console.log( colors.red('[line ' + error.line + ' col ' + error.character + '] ' + error.reason) );   
            console.log( colors.grey('=> ') + colors.red(error.evidence) );   
        });
        throw new gutil.PluginError( 'jslint', colors.red('Jshint failure, plese check the error message.') );
    }

    callback( null, file );
});

// 自定义csslint错误报告
var csslintReporter = function( file ){
    var currentCsslint = file.csslint;

    if( currentCsslint.errorCount ){
        console.log( '\n' );
        console.log( colors.red('[' + currentCsslint.errorCount + '] errors in ' + file.path) );

        currentCsslint.results.forEach(function( result ){
            var error = result.error;

            console.log( colors.grey('------------------------------------------------------------------------------') );
            console.log( colors.red('[line ' + error.line + ' col ' + error.col + '] ' + error.message) );
            console.log( colors.grey('=> ') + colors.red(error.evidence) );
        });

        throw new gutil.PluginError( 'csslint', colors.red('Csslint failure, plese check the error message.') );
    }
};

// csslint任务
gulp.task( 'csslint', function(){
    return gulp.src( options.csslint.src )
        .pipe( csslint(csslintrc) )
        .pipe( csslint.reporter(csslintReporter) );        
});
//压缩css
gulp.task('minifycss', function() {
    return gulp.src(options.csslint.src)      //压缩的文件
        .pipe(gulp.dest('min/css'))   //输出文件夹
        .pipe(minifycss());   //执行压缩
})

// jshint任务
gulp.task( 'jshint', function(){
    return gulp.src( options.jshint.widgetSrc )
        .pipe( jshint(jshintrc) )
        .pipe( jshintReporter );
});

//压缩lib下的js
gulp.task('minifyLibJs', function() {
    return gulp.src(options.jshint.libSrc)
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('min/js/lib'));  //输出
});
//压缩widget下的js
gulp.task('minifyWidgetJs', function() {
    return gulp.src(options.jshint.widgetSrc)
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('min/js/widget'));  //输出
});
//合并merge/list下的js
gulp.task('mergeJs', function() {
    return gulp.src('merge/list/js/*.js')
        .pipe(concat('all.js'))    //合并
        .pipe(gulp.dest('merge/all/js'));  //输出
});
//合并merge/list下的css
gulp.task('mergeCss', function() {
    return gulp.src('merge/list/css/*.css')
        .pipe(concat('all.css'))    //合并
        .pipe(gulp.dest('merge/all/css'));  //输出
});
//检查
gulp.task( 'default', ['csslint', 'jshint'], function(){
    gulp.src( './conf/conf.json', {
        read : false
    })
    .pipe(notify({
        message : 'All lint task complete, without error.'
    }));
});
//压缩
gulp.task( 'minify', ['minifycss', 'minifyLibJs','minifyWidgetJs'], function(){
    gulp.src( './conf/conf.json', {
        read : false
    })
    .pipe(notify({
        message : 'All minify task complete, without error.'
    }));
});

//合并
gulp.task( 'mergeList', ['mergeCss', 'mergeJs'], function(){
    gulp.src( './conf/conf.json', {
        read : false
    })
    .pipe(notify({
        message : 'All minify task complete, without error.'
    }));
});