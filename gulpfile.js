var gulp=require("gulp"),
    concat=require("gulp-concat"),
    concatcss=require("gulp-concat-css");
 gulp.task('jshint',function(){
    return gulp.src(['node_modules/jquery/dist/jquery.js','node_modules/angular/angular.js','node_modules/bootstrap/dist/js/bootstrap.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./public/dest/'));
});

gulp.task('css-concat',function(){
    gulp.src(['./public/css/app.css','./public/css/normalize.css','node_modules/bootstrap/dist/css/bootstrap.css'])
    .pipe(concatcss('base.css'))
    .pipe(gulp.dest('./public/css/'))
});
gulp.task('default',['jshint','css-concat']);