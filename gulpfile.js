const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');

gulp.task('css', function(done){
    console.log('task to minify css');
    gulp.src('./assets/scss/*.scss')
        .pipe(gulpSass())
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css'));    
    console.log('minify css success');
    done();
});

gulp.task('hashCssFileName', function(done){
     gulp.src('./assets/**/*.css')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest('public/assets/rev-manifest.json',{
            base: 'public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    console.log('created css files in public');
    done();
});

gulp.task('js', function(done){
    console.log('minifying js files');
     gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest('public/assets/rev-manifest.json',{
        base: 'public/assets',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


gulp.task('images', function(done){
    console.log('compressing images');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest('public/assets/rev-manifest.json',{
        base: 'public/assets',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});


// empty the public/assets directory
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'hashCssFileName',  'js', 'images'), function(done){
    console.log('generating assets in the mentioned sequence');
    done();
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
//         base: 'public',
//         merge: true
//     }))
//     .pipe(gulp.dest('./public/assets'));
// })


