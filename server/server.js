const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const prerender = require('prerender-node');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const crypto = require('crypto');
const port = 80;
const proxy = require('http-proxy-middleware');
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(prerender.set('prerenderServiceUrl', 'http://127.0.0.1:3000'));
app.use('/', express.static(path.join(__dirname, '../static'), {
    'index': ['index.html', 'index.htm', 'app.htm']
}));
app.use('/api/sho', proxy({
    target: 'http://route.showapi.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/sho': ''
    },
    logLevel: 'info'
}));
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
let login = require('./login')(mgo);
app.use('/login', login);
let common = require('./common')(mgo);
app.use('/api/web/common', common);
let album = require('./album')(mgo);
app.use('/api/web/album', album);
let Form = require('./form')(mgo);
app.use('/api/web/form', Form);
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
app.listen(port, function() {});
module.exports = app;