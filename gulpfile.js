const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');

gulp.task('css', function(){
    console.log('task to minify css');
    return gulp.src('./assets/scss/*.scss')
    .pipe(gulpSass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets/css'));    
});

gulp.task('hashCssFileName',function(){
    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
});

// gulp.task('css', function(){
//     console.log('minifying css...');
//     gulp.src('./assets/**/*.scss')
//     .pipe(gulpSass())
//     .pipe(cssnano())
//     .pipe(gulp.dest('./assets'));

//     return gulp.src('./assets/**/**/.css')
//     .pipe(rev())

//     .pipe(gulp.dest('./public/assets'))
//     .pipe(rev.manifest({
//         cwd: 'public',
//         merge: true
//     }))
//     .pipe(gulp.dest('./public/assets'));
// })


