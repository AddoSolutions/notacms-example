// gulpfile.js
// Heavily inspired by Mike Valstar's solution:
//   http://mikevalstar.com/post/fast-gulp-browserify-babelify-watchify-react-build/
"use strict";

const gulp       = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');


const cssPath = "static";

module.exports = {
    less: () => {
        console.log("Gulp: Processing site.less");
        return gulp.src(cssPath+'/app.less')
            .pipe(sourcemaps.init())
            .pipe(less({
                //compress:true
            }))
            .pipe(cleanCSS({compatibility: 'ie8'}))
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest('./'+cssPath));
    },
    watch: () => {
        console.log("Gulp: Watching files for changes");
        gulp.watch(cssPath + "/**/*.less", module.exports.less);

        if(!process.env.NO_BROWSERSYNC) browserSync.init(null, {
            proxy: "http://localhost:8000",
            files: [cssPath + "/**/*.css", "templates/**/*.html"],
            browser: "google chrome",
            port: 7000,
        });
    }
}

gulp.task('less', module.exports.less);


gulp.task('watch', module.exports.watch);