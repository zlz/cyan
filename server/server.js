const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
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
app.use('/', express.static(path.join(__dirname, '../static'), {
    index: false
}));
app.use('/api/sho', proxy({
    target: 'http://route.showapi.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/sho': ''
    },
    logLevel: 'info'
}));
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
let index = require('./index');
app.use('/', index);
const mgo = require('./mdb');
let login = require('./login')(mgo);
app.use('/login', login);
let common = require('./api.common')(mgo);
app.use('/api/web/common', common);
let album = require('./api.album')(mgo);
app.use('/api/web/album', album);
let form = require('./api.form')(mgo);
app.use('/api/web/form', form);
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