import gulp from 'gulp';
//import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import del from 'del';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import gulpIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import imageminPngquant from 'imagemin-pngquant';
import less from 'gulp-less';
//import uglify from 'gulp-uglify';
import webpackST from 'webpack-stream';
import gcMq from 'gulp-group-css-media-queries';
import smartGrid from 'smart-grid';
import plumber from 'gulp-plumber';
import svgmin from 'gulp-svgmin';


//const {series, parallel, src, dest, task} = gulp;


let isDev = process.argv.includes('--dev');
let isProd = !isDev;
let isSync = process.argv.includes('--sync');

//console.log(process.argv);

let config = {
    src: './src/',
    build: './build',
    html: {
        src: '**/*.html',
        dest: '/'
    },
    favicon: {
        src: '**/*.ico',
        dest: '/'
    },
    img: {
        src: 'assets/img/**/*.+(png|jpg|gif)',
        dest: '/assets/img'
    },
    svg: {
        src: 'assets/img/svg/**/*.svg',
        dest: '/assets/img/svg'
    },
    css: {
        gridCss: 'assets/css',
        src: 'assets/css/styles.less',
        watch: 'assets/css/**/*.less',
        dest: '/assets/css'
    },

    fonts: {
        src: 'assets/fonts/**/*',
        dest: '/assets/fonts'
    },

    js: {
        src: 'assets/js/index.js',
        watch: 'assets/js/**/*.js',
        dest: '/assets/js'
    }
};

let webConfig = {
    output: {
        filename: 'all.js'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                //exclude: /(node_modules)/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',

                }
            }
        ]
    },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : false
}


function html() {
    return gulp.src(config.src + config.html.src)
        //.pipe(gulpIf(isDev, plumber()))
        //.pipe(plumber())
        .pipe(gulp.dest(config.build + config.html.dest))
        .pipe(gulpIf(isSync, browserSync.stream()));
}

function favicon() {
    return gulp.src(config.src + config.favicon.src)
        .pipe(gulpIf(isProd, plumber()))
        //.pipe(plumber())
        .pipe(gulp.dest(config.build + config.favicon.dest));
}

function img() {
    return gulp.src(config.src + config.img.src)
        .pipe(gulpIf(isProd, imagemin(
            [
                imageminPngquant({
                    quality: [0.7, 0.9]
                })
            ]
        )))
        .pipe(gulp.dest(config.build + config.img.dest));
}

function svg() {
    return gulp.src(config.src + config.svg.src)
        .pipe(gulpIf(isProd,svgmin({
        })))
        //.pipe(newer(config.build + config.svg.dest))
        //.pipe(gulpIf(isDev, gulp.symlink(config.build + config.svg.dest), gulp.dest(config.build + config.svg.dest)));
        .pipe(gulp.dest(config.build + config.svg.dest))
        //.pipe(gulpIf(isSync, browserSync.stream()));
}


function fonts() {
    return gulp.src(config.src + config.fonts.src)
        //.pipe(gulpIf(isDev, plumber()))
        //.pipe(newer(config.build + config.fonts.dest))
        // .pipe(gulpIf(isDev, gulp.symlink(config.build + config.fonts.dest), gulp.dest(config.build + config.fonts.dest)));
        .pipe(gulp.dest(config.build + config.fonts.dest))
        //.pipe(gulpIf(isSync, browserSync.stream()));
}

function js() {
    return gulp.src(config.src + config.js.src)
        .pipe(gulpIf(isDev, plumber()))
        .pipe(webpackST(webConfig))
        .pipe(gulp.dest(config.build + config.js.dest))
        .pipe(gulpIf(isSync, browserSync.stream()));
}


function css() {
    return gulp.src(config.src + config.css.src)
        //.pipe(gulpIf(isDev, plumber()))
        .pipe(gulpIf(isDev, plumber(), sourcemaps.init()))
        .pipe(less())
        .pipe(gcMq())
        .pipe(autoprefixer())
        .pipe(gulpIf(isProd, cleanCSS({
            level: 2
        })))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest(config.build + config.css.dest))
        .pipe(gulpIf(isSync, browserSync.stream()));
}


function grid(done) {

    let gridSettings = {
        columns: 12,
        offset: "8px",
        //offset: "1.8%",
        container: {
            maxWidth: "1380px"
            //fields: "30px"
        },
        breakPoints: {
            md: {
                width: "992px"
                //fields: "15px"
            },
            sm: {
                width: "720px"
            },
            xs: {
                width: "576px"
            },
            xxs: {
                width: "400px"
            }
        }
    }

    //smartGrid(config.src + 'css', gridSettings);
    smartGrid(config.src + config.css.gridCss, gridSettings);
    done();
}


function clear() {
    return del(config.build + '/*')
}

function watch() {
    if (isSync) {
        browserSync.init({
            server: {
                baseDir: config.build
            }
        });
    }
    gulp.watch(config.src + config.html.src, html)
    gulp.watch(config.src + config.css.watch, css)
    gulp.watch(config.src + config.js.watch, js)
    //gulp.watch(config.src + config.js.watch, fonts)
    //gulp.watch(config.src + config.js.watch, svg)
}

let build = gulp.series(clear,
    gulp.parallel(html, img, css, js, favicon, fonts, svg)
);

gulp.task('build', gulp.series(clear,
    gulp.parallel(html, img, css, js, favicon, fonts, svg)
));

gulp.task('watch', gulp.series(build, watch));

gulp.task('grid', grid);






