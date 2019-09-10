var gulp = require('gulp');
var uglify = require('gulp-uglify');
var del = require('del');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
//css 打包压缩
// var autoprefix = require('gulp-autoprefixer');
// var minifyCSS = require('gulp-minify-css');
var minifyCSS = require('gulp-clean-css');

var through = require('through2');
var jade = require('jade');
// async function  uglifyCSS(isWatch){
//     let src = 'public/stylesheets/**/*.css'
//     if(!isWatch){
//         // 不是监听状态时
//         await del(['dist/stylesheets']);
//     }
//     let pipe1 = gulp.src(src)
//     if(isWatch){
//         // 是监听状态时
//         pipe1 = pipe1.pipe(changed("dist/stylesheets")) // 只更新修改过的文件
//     }
//     pipe1.pipe(minifyCSS()) // 压缩css
//         .on('error', function(err) {    // 解决编译出错，监听被阻断的问题
//             console.log('uglifyCSS Error!', err.message);
//             this.end();
//         })
//         .pipe(gulp.dest('dist/stylesheets/'));
// }
gulp.task('uglifyCSS',async()=>{
    // await del(['dist/stylesheets']);
    let sourceSrc = 'public/stylesheets/**/*.css'
    let destSrc = 'dist/stylesheets/'
    gulp.src(sourceSrc)
        .pipe(changed(destSrc)) // 只更新修改过的文件
        .pipe(minifyCSS()) // 压缩css
        .on('error', function(err) {    // 解决编译出错，监听被阻断的问题
            console.log('uglifyCSS Error!', err.message);
            this.end();
        })
        .pipe(gulp.dest(destSrc));
});
gulp.task('uglifyJS',async()=>{
    // await del(['dist/javascripts']);
    // 以min.js结尾的无须压缩，直接copy
    let sourceSrc = 'public/javascripts/**/*[^(min)].js'
    let destSrc = "dist/javascripts/"
    gulp.src(sourceSrc)
        .pipe(changed(destSrc)) // 只更新修改过的文件
        .pipe(babel())
        .on('error', function(err) {    // 解决编译出错，监听被阻断的问题
            console.log('uglifyJS Error!', err.message);
            this.end();
        })
        .pipe(uglify()) //压缩
        .pipe(gulp.dest(destSrc)); //打包目录。
    // 以min.js结尾的无须压缩，直接copy
    let sourceSrc1 = 'public/javascripts/**/*min.js'
    gulp.src(sourceSrc1)
        .pipe(changed(destSrc)) // 只更新修改过的文件
        .pipe(gulp.dest(destSrc))
});

gulp.task('templates', async()=> {
    await del(['dist/templates']);
    gulp.src('views/templates/*.jade')
        .pipe(through.obj(function (file, enc, cb){
            let opts = {
                filename:file.path,
                data:file.data,
                name:file.relative.split(".")[0]+"Template",
                client:true
            }

            file.path = file.path.split(".")[0]+".js"
            var compiled;
            var contents = String(file.contents);
            compiled = jade.compileClient(contents, opts);
            file.contents = new Buffer(compiled);
            cb(null, file);
        }))
        .pipe(gulp.dest('dist/templates'))
});
gulp.task('updataTemplates', async()=> {
    gulp.src('views/templates/*.jade')
        .pipe(changed("dist/templates"))
        .pipe(through.obj(function (file, enc, cb){
            let opts = {
                filename:file.path,
                data:file.data,
                name:file.relative.split(".")[0]+"Template",
                client:true
            }

            file.path = file.path.split(".")[0]+".js"
            var compiled;
            var contents = String(file.contents);
            compiled = jade.compileClient(contents, opts);
            file.contents = new Buffer(compiled);
            cb(null, file);
        }))
        .pipe(gulp.dest('dist/templates'))
});

gulp.task('watch',async()=>{
    gulp.watch('public/stylesheets/**/*.css',gulp.parallel('uglifyCSS'));
    gulp.watch('public/javascripts/**/*[^(min)].js',gulp.parallel('uglifyJS'));
    gulp.watch('views/templates/*.jade',gulp.parallel('updataTemplates'));
})
// gulp.task('lib',async()=>{
//     await del(['dist/lib']);
//     // lib目录原样拷贝
//     gulp.src('public/lib/**/*')
//         .pipe(gulp.dest('dist/lib/')); //打包目录。
// });
gulp.task('default',gulp.parallel('uglifyCSS','uglifyJS','templates','watch'));
