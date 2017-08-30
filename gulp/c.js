module.exports = (...param) => {
    const gulp = require('gulp');
    const $ = require('gulp-load-plugins')();
    const del = require('del');
    const path = require('path');
    const runSequence = require('run-sequence');
    const glob = require('glob');
    const webpack = require('webpack');
    const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
    const status = param[0];
    const src = './src/c/';
    const dist = './dist/c/';
    let paths = {
        src: {
            style: [src + 'styles/**/*', './mods/**/*.scss'],
            htm: [src + '**/*.htm', src + '**/*.html'],
            img: src + 'images/**/*',
            data: src + 'datas/**/*',
            font: './fonts/**/*',
            mod: './mods/**/*.js'
        },
        dist: {
            style: dist + 'styles',
            htm: dist,
            img: dist + 'images',
            data: dist + 'datas',
            font: dist + 'fonts'
        },
        entry: {},
        output: dist + 'scripts',
        concat: {
            css: [
                dist + 'styles/cyan/cyan.common.min.css',
                './fonts/iconfont.css',
                './node_modules/bootstrap/dist/css/bootstrap.css',
                './node_modules/animate.css/animate.css',
                dist + 'styles/common.min.css',
                './mods/zSlide/zslide.css'
            ]
        }
    };
    let getEntryMap = src => {
        let arr = glob.sync(src, { nodir: true });
        let i;
        for (i = 0; i < arr.length; i = i + 1) {
            let item = arr[i];
            paths.entry[item.substring(item.lastIndexOf('/') + 1, item.lastIndexOf('.'))] = item;
        }
    };
    getEntryMap('./mods/**/!(*min).js');
    getEntryMap(src + 'scripts/**/!(directive*|provider*|filter*).js');
    console.log(paths.entry);
    let errHandler = err => {
        $.util.log(err.message);
        this.emit('end');
    };
    gulp.task('clean', () => {
        return del([dist + '**/*'], { force: true });
    });
    gulp.task('style', () => {
        let filterScss = $.filter('**/*.scss', { restore: true });
        return gulp
            .src(paths.src.style)
            .pipe($.changed(paths.dist.style, { extension: '.min.css' }))
            .on('data', file => {
                $.util.log(file.path);
            })
            .pipe(filterScss)
            .pipe($.sass({ outputStyle: 'expanded' }).on('error', errHandler))
            .pipe(
                $.autoprefixer({
                    browsers: ['last 2 versions', 'ie 9', 'Android 3'],
                    cascade: false
                })
            )
            .pipe($.csso())
            .on('error', errHandler)
            .pipe($.rename({ suffix: '.min' }))
            .pipe(filterScss.restore)
            .pipe(gulp.dest(paths.dist.style));
    });
    gulp.task('styleConcat', ['style'], () => {
        return gulp
            .src(paths.concat.css)
            .pipe(
                $.autoprefixer({
                    browsers: ['last 2 versions', 'ie 9', 'Android 3'],
                    cascade: false
                })
            )
            .pipe($.csso())
            .pipe($.concat('vendor.common.min.css'))
            .pipe(gulp.dest(paths.dist.style));
    });
    gulp.task('webpack', cb => {
        let filename = '';
        let chunkFilename = '';
        if (status === 'dev') {
            filename = '[name].bundle.min.js';
            chunkFilename = '[name].chunk.min.js';
        } else if (status === 'prod') {
            // filename = '[name].bundle.[hash].min.js';
            // chunkFilename = '[name].chunk.min.js';
            filename = '[name].bundle.min.js';
            chunkFilename = '[name].chunk.min.js';
        }
        webpack(
            {
                entry: paths.entry,
                output: {
                    path: path.resolve(__dirname, '../' + paths.output),
                    filename: filename,
                    chunkFilename: chunkFilename
                },
                plugins: [new UglifyJSPlugin({ comments: false })],
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            include: [
                                path.resolve(__dirname, '../' + src + 'scripts'),
                                path.resolve(__dirname, '../mods')
                            ],
                            use: [{ loader: 'babel-loader' }]
                        }
                    ]
                },
                resolve: {},
                externals: {}
            },
            (err, stats) => {
                if (err) {
                    throw new $.util.PluginError('webpack', err);
                }
                $.util.log(
                    '[webpack]',
                    stats.toString(
                        {
                            // output options
                        }
                    )
                );
                if (cb && cb instanceof Function) {
                    cb();
                }
            }
        );
    });
    gulp.task('rootFile', () => {
        return gulp.src(src + '*.ico').pipe(gulp.dest(dist));
    });
    gulp.task('htm', () => {
        return gulp
            .src(paths.src.htm)
            .pipe(
                $.htmlmin({
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    minifyCSS: true,
                    minifyJS: true,
                    sortAttributes: true,
                    sortClassName: true,
                    useShortDoctype: true
                })
            )
            .pipe(gulp.dest(paths.dist.htm));
    });
    gulp.task('img', () => {
        return gulp.src(paths.src.img).pipe(gulp.dest(paths.dist.img));
    });
    gulp.task('data', () => {
        return gulp.src(paths.src.data).pipe(gulp.dest(paths.dist.data));
    });
    gulp.task('font', () => {
        return gulp.src(paths.src.font).pipe(gulp.dest(paths.dist.font));
    });
    gulp.task('watch', () => {
        if (status === 'dev') {
            gulp.watch(paths.src.style, ['styleConcat']);
            gulp.watch(src + '/*.*', ['rootFile']);
            gulp.watch(paths.src.htm, ['htm']);
            gulp.watch(paths.src.img, ['img']);
            gulp.watch(paths.src.data, ['data']);
            gulp.watch(paths.src.font, ['styleConcat', 'font']);
            gulp.watch(paths.src.script, ['webpack']);
        } else {
            return true;
        }
    });
    gulp.task('run', () => {
        runSequence('clean', ['rootFile', 'htm', 'img', 'data', 'font', 'styleConcat'], 'webpack', 'watch');
    });
    return gulp.start('run');
};
