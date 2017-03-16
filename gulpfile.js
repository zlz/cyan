const gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    open = require('open'),
    path = require('path'),
    proxy = require('http-proxy-middleware'),
    webpack = require('webpack'),
    runSequence = require('run-sequence'),
    paths = {
        src: {
            root: './src',
            style: './src/styles/**/*',
            js: './src/scripts/**/*.js',
            view: './src/views/**/*',
            img: './src/images/**/*',
            data: './src/datas/**/*',
            font: './src/fonts/**/*',
            vendor: './src/vendors/**/*',
            entry: {
                'vendor.common': './src/scripts/vendor.common',
                app: './src/scripts/app'
            }
        },
        dest: {
            root: './dist',
            style: './dist/styles',
            js: './dist/scripts',
            view: './dist/views',
            img: './dist/images',
            data: './dist/datas',
            font: './dist/fonts',
            vendor: './dist/vendors'
        },
        concat: {
            css: ['./dist/styles/cyan.common.min.css', './dist/vendors/bootstrap/dist/css/bootstrap.css', './dist/vendors/font-awesome/css/font-awesome.css', './dist/styles/common.min.css', './src/scripts/mods/zSlide/zslide.css']
        }
    };
let status = '';
gulp.task('clean', () => {
    if (status === 'dev') {
        return del([paths.dest.root + '/**/*', '!' + paths.dest.vendor + '/**']);
    } else {
        return del([paths.dest.root + '/**/*']);
    }
});
gulp.task('style', () => {
    let scss = $.filter('**/*.scss', {
        restore: true
    });
    return gulp.src(paths.src.style)
        .pipe($.changed(paths.dest.style, {
            extension: '.min.css'
        }))
        .on('data', (file) => {
            $.util.log(file.path);
        })
        .pipe(scss)
        .pipe($.sass(
            {
                outputStyle: 'expanded'
            })
            .on('error', (err) => {
                $.util.log(err.message);
                this.emit('end');
            }))
        .pipe(scss.restore)
        .pipe($.csso())
        .pipe($.autoprefixer('last 2 version', 'safari5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
        .on('error', (err) => {
            $.util.log(err.message);
            this.emit('end');
        })
        .pipe($.rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dest.style));
});
gulp.task('styleConcat', ['style'], () => {
    return gulp.src(paths.concat.css)
        .pipe($.csso())
        .pipe($.autoprefixer('last 2 version', 'safari5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe($.concat('vendor.common.min.css'))
        .pipe(gulp.dest(paths.dest.style));
});
gulp.task('js', () => {
    return gulp.src(paths.src.js)
        .pipe($.changed(paths.dest.js, {
            extension: '.min.js'
        }))
        .on('data', (file) => {
            $.util.log(file.path);
        })
        // .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015'],
            compact: true,
            comments: false
        }))
        .on('error', (err) => {
            $.util.log(err.fileName, err.lineNumber, err.message);
            this.emit('end');
        })
        .pipe($.rename({
            suffix: '.min'
        }))
        // .pipe($.sourcemaps.write('./', {
        //     includeContent: false,
        //     sourceRoot: '/src/scripts'
        // }))
        .pipe(gulp.dest(paths.dest.js));
});
gulp.task('webpack', (callback) => {
    const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
    let filename = '';
    let chunkFilename = '';
    if (status === 'dev') {
        filename = '[name].bundle.min.js';
        chunkFilename = '[name].chunk.min.js';
    } else if (status === 'prod') {
        filename = '[name].bundle.[hash].min.js';
        chunkFilename = '[name].chunk.min.js';
    }
    webpack({
        entry: paths.src.entry,
        output: {
            path: path.join(__dirname, paths.dest.js),
            filename: filename,
            chunkFilename: chunkFilename
        },
        plugins: [
            new UglifyJSPlugin({
                compress: {
                    warnings: false
                }
            })
        ],
        module: {
            rules: [{
                test: path.join(__dirname, 'src/scripts'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['transform-runtime']
                    }
                }]
            }]
        },
        resolve: {},
        externals: {}
    }, (err, stats) => {
        if (err) {
            throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({
            // output options
        }));
        callback();
    });
});
gulp.task('rootFile', () => {
    return gulp.src(paths.src.root + '/*.*')
        .pipe(gulp.dest(paths.dest.root));
});
gulp.task('view', () => {
    return gulp.src(paths.src.view)
        .pipe(gulp.dest(paths.dest.view));
});
gulp.task('img', () => {
    return gulp.src(paths.src.img)
        .pipe(gulp.dest(paths.dest.img));
});
gulp.task('data', () => {
    return gulp.src(paths.src.data)
        .pipe(gulp.dest(paths.dest.data));
});
gulp.task('font', () => {
    return gulp.src(paths.src.font)
        .pipe(gulp.dest(paths.dest.font));
});
gulp.task('bower', () => {
    if (status === 'dev') {
        return true;
    } else if (status === 'prod') {
        return $.bower();
    }
});
gulp.task('watch', () => {
    gulp.watch(paths.src.style, ['styleConcat']);
    gulp.watch(paths.src.root + '/*.*', ['rootFile']);
    gulp.watch(paths.src.view, ['view']);
    gulp.watch(paths.src.img, ['img']);
    gulp.watch(paths.src.data, ['data']);
    gulp.watch(paths.src.vendor, ['vendor']);
    gulp.watch(paths.src.js, ['webpack']);
});
gulp.task('connect', () => {
    $.connect.server({
        debug: true,
        root: ['dist'],
        index: false,
        port: 80,
        fallback: 'dist/app.htm',
        middleware: () => {
            return [
                proxy(['/api/admin', '/api/web'], {
                    target: 'http://127.0.0.1:9090',
                    changeOrigin: false
                }),
                proxy(['/api/cho'], {
                    target: 'http://dig.chouti.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api/cho': ''
                    },
                    logLevel: 'info'
                }),
                proxy(['/api/sho'], {
                    target: 'http://route.showapi.com',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api/sho': ''
                    },
                    logLevel: 'info'
                }),
                proxy(['/project', '/sso', '/authManage', '/indexController', '/globalPermissionManage', '/systemDDL', '/treeController'], {
                    target: 'http://192.168.32.33:9080',
                    changeOrigin: false
                })
            ];
        }
    });
    open('http://127.0.0.1');
});
gulp.task('shell', () => {
    return gulp.src('*.js', {
            read: false
        })
        .pipe($.shell(['node ./node_modules/justreq-cli/bin/justreq start -c']));
});
gulp.task('run', () => {
    runSequence('clean', 'bower', ['rootFile', 'view', 'img', 'data', 'font', 'styleConcat'], 'webpack', 'watch', 'connect', 'shell');
});
gulp.task('default', () => {
    status = 'dev';
    gulp.start('run');
});
gulp.task('prod', () => {
    status = 'prod';
    gulp.start('run');
});