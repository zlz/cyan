const gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    fs = require('fs'),
    del = require('del'),
    http = require('http'),
    path = require('path'),
    url = require('url'),
    webpack = require('webpack'),
    runSequence = require('run-sequence'),
    paths = {
        src: {
            root: './src',
            style: './src/styles/**/*',
            js: './src/scripts/**/*.js',
            view: './src/views/**/*',
            img: './src/images/**/*',
            vendor: './src/vendors/**/*',
            entry: {
                'vendor.common': './src/scripts/vendor.common',
                app: './src/scripts/controllers/app'
            }
        },
        dest: {
            root: './dist',
            style: './dist/styles',
            js: './dist/scripts',
            view: './dist/views',
            img: './dist/images',
            vendor: './dist/vendors'
        },
        tmp: './tmp',
        concat: {
            css: ['./dist/styles/cyan.common.min.css', './dist/vendors/bootstrap/dist/bootstrap.min.css', './dist/styles/common.min.css']
        }
    };
let status = '';
gulp.task('clean', function() {
    if (status === 'dev') {
        return del([paths.dest.root + '/**/*', '!' + paths.dest.vendor + '/**']);
    } else {
        return del([paths.dest.root + '/**/*']);
    }
});
gulp.task('style', function() {
    let scss = $.filter('**/*.scss', {
        restore: true
    });
    return gulp.src(paths.src.style).pipe($.changed(paths.dest.style, {
        extension: '.min.css'
    })).on('data', function(file) {
        $.util.log(file.path);
    }).pipe(scss).pipe($.sass({
        outputStyle: 'expanded'
    }).on('error', function(err) {
        $.util.log(err.message);
        this.emit('end');
    })).pipe(scss.restore).pipe($.csso()).pipe($.autoprefixer('last 2 version', 'safari5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4')).on('error', function(err) {
        $.util.log(err.message);
        this.emit('end');
    }).pipe($.rename({
        suffix: '.min'
    })).pipe(gulp.dest(paths.dest.style));
});
gulp.task('styleConcat', ['style'], function() {
    return gulp.src(paths.concat.css).pipe($.concat('vendor.common.min.css')).pipe(gulp.dest(paths.dest.style));
});
gulp.task('js', function() {
    return gulp.src(paths.src.js).pipe($.changed(paths.dest.js, {
            extension: '.min.js'
        })).on('data', function(file) {
            $.util.log(file.path);
        })
        // .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015'],
            compact: true,
            comments: false
        })).on('error', function(err) {
            $.util.log(err.fileName, err.lineNumber, err.message);
            this.emit('end');
        }).pipe($.rename({
            suffix: '.min'
        }))
        // .pipe($.sourcemaps.write('./', {
        //     includeContent: false,
        //     sourceRoot: '/src/scripts'
        // }))
        .pipe(gulp.dest(paths.dest.js));
});
gulp.task('webpack', function(callback) {
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
                        presets: ['es2015'],
                        plugins: ['transform-runtime']
                    }
                }]
            }]
        },
        resolve: {},
        externals: {}
    }, function(err, stats) {
        if (err) {
            throw new $.util.PluginError('webpack', err);
        }
        $.util.log('[webpack]', stats.toString({
            // output options
        }));
        callback();
    });
});
gulp.task('rootFile', function() {
    return gulp.src(paths.src.root + '/*.*').pipe(gulp.dest(paths.dest.root));
});
gulp.task('view', function() {
    return gulp.src(paths.src.view).pipe(gulp.dest(paths.dest.view));
});
gulp.task('img', function() {
    return gulp.src(paths.src.img).pipe(gulp.dest(paths.dest.img));
});
gulp.task('bower', function() {
    if (status === 'dev') {
        return true;
    } else if (status === 'prod') {
        return $.bower();
    }
});
gulp.task('watch', function() {
    gulp.watch(paths.src.style, ['styleConcat']);
    gulp.watch(paths.src.root + '/*.*', ['rootFile']);
    gulp.watch(paths.src.view, ['view']);
    gulp.watch(paths.src.img, ['img']);
    gulp.watch(paths.src.vendor, ['vendor']);
    gulp.watch(paths.src.js, ['webpack']);
});
gulp.task('server', function() {
    console.time('[server][Start]');
    const getContentType = function(filePath) {
        let contentType = '';
        const ext = path.extname(filePath);
        switch (ext) {
            case '.html':
                contentType = 'text/html';
                break;
            case '.htm':
                contentType = 'text/html';
                break;
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.jpg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.ico':
                contentType = 'image/icon';
                break;
            default:
                contentType = 'application/octet-stream';
        }
        return contentType;
    };
    const server = http.createServer(function(req, res) {
        let reqUrl = req.url;
        console.log(reqUrl);
        let pathName = url.parse(reqUrl).pathname;
        if (path.extname(pathName) === '') {
            pathName += '/';
        }
        if (pathName.charAt(pathName.length - 1) === '/') {
            pathName += 'app.htm';
        }
        let filePath = path.join('./dist/', pathName);
        fs.exists(filePath, function(exists) {
            if (exists) {
                res.writeHead(200, {
                    'Content-Type': getContentType(filePath)
                });
                var stream = fs.createReadStream(filePath, {
                    flags: 'r',
                    encoding: null
                });
                stream.on('error', function() {
                    res.writeHead(404);
                    res.end('<h1>404 Read Error</h1>');
                });
                stream.pipe(res);
            } else {
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });
                res.end('<h1>404 Not Found</h1>');
            }
        });
    });
    server.on('error', function(error) {
        console.log(error);
    });
    server.listen(8899, function() {
        console.log('[server][Start] running at http://127.0.0.1:8899/');
        console.timeEnd('[server][Start]');
    });
});
gulp.task('run', function() {
    runSequence('clean', 'bower', ['rootFile', 'view', 'img', 'styleConcat'], 'webpack', 'watch', 'server');
});
gulp.task('default', function() {
    status = 'dev';
    gulp.start('run');
});
gulp.task('prod', function() {
    status = 'prod';
    gulp.start('run');
});