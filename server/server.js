const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const proxy = require('http-proxy-middleware');
const morgan = require('morgan');
app.use(morgan('common'));
const helmet = require('helmet');
app.use(helmet());
const cors = require('cors');
app.use(cors());
const compression = require('compression');
app.use(compression());
const path = require('path');
app.use('/', express.static(path.join(__dirname, '../static/c'), { index: false }));
app.use('/b', express.static(path.join(__dirname, '../static/b'), { index: false }));
app.use(
    '/api/c/sho',
    proxy({
        target: 'http://route.showapi.com',
        changeOrigin: true,
        pathRewrite: { '^/api/c/sho': '' },
        logLevel: 'info'
    })
);
const crypto = require('crypto');
app.get('/wx', function(req, res) {
    const token = 'sdfs825dja';
    let signature = req.param('signature');
    let timestamp = req.param('timestamp');
    let nonce = req.param('nonce');
    let echostr = req.param('echostr');
    let checkSignature = function(signature, timestamp, nonce) {
        let tmpArr = [token, timestamp, nonce];
        tmpArr.sort();
        let tmpStr = tmpArr.join('');
        let shasum = crypto.createHash('sha1');
        shasum.update(tmpStr);
        let shaResult = shasum.digest('hex');
        if (shaResult === signature) {
            return true;
        }
        return false;
    };
    if (checkSignature(signature, timestamp, nonce)) {
        res.send(echostr);
    } else {
        res.json(200, {
            code: -1,
            msg: 'WX Error'
        });
    }
});
const mgo = require('./mdb');
let bApp = require('./b/app');
app.use('/b', bApp);
let apiBLogin = require('./b/api.login')(mgo);
app.use('/api/b/login', apiBLogin);
let apiBCommon = require('./b/api.common')(mgo);
app.use('/api/b/common', apiBCommon);
let apiBNews = require('./b/api.news')(mgo);
app.use('/api/b/news', apiBNews);
let cApp = require('./c/app');
app.use('/', cApp);
let apiCCommon = require('./c/api.common')(mgo);
app.use('/api/c/common', apiCCommon);
let apiCAlbum = require('./c/api.album')(mgo);
app.use('/api/c/album', apiCAlbum);
let form = require('./c/api.form')(mgo);
app.use('/api/c/form', form);
app.use((req, res, next) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
    next();
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
    next();
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
    next();
});
const port = 80;
app.listen(port, function() {});
module.exports = app;
