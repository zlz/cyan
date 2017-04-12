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
const mongoose = require('mongoose');
const port = 80;
const proxy = require('http-proxy-middleware');
mongoose.connect('mongodb://127.0.0.1/cyan');
let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', () => {
    console.log('MongoDB Opened!');
});
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(prerender.set('prerenderServiceUrl', 'http://127.0.0.1:3000'));
app.use('/', express.static(path.join(__dirname, 'dist'), {
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
app.get('/login', (req, res) => {
    res.sendfile(path.join(__dirname, 'dist/views/login.htm'));
});
app.post('/api/login', (req, res) => {
    res.send({
        data: {
            name: req.body.name,
            pswd: req.body.pswd
        },
        status: 200
    });
});
let CommonSchema = new mongoose.Schema();
let CommonModel = mdb.model('Common', CommonSchema);
app.get('/api/web/common', (req, res) => {
    if (req.query.lang) {
        CommonModel.find({}, {
            [req.query.lang]: 1,
            _id: 0
        }, (err, docs) => {
            res.send({
                data: docs[0].toJSON()[req.query.lang].common,
                params: req.query,
                status: 200
            });
        });
    } else {
        res.status(500);
        res.end();
    }
});
let AlbumSchema = new mongoose.Schema();
let AlbumModel = mdb.model('Album', AlbumSchema);
app.get('/api/web/album', (req, res) => {
    AlbumModel.find((err, docs) => {
        res.send({
            data: docs,
            params: req.query,
            status: 200
        });
    });
});
let FormSchema = new mongoose.Schema({
    email: 'String',
    qq: 'Number',
    msg: 'String',
    name: 'String'
});
let FormModel = mdb.model('Form', FormSchema);
app.get('/api/web/form', (req, res) => {
    FormModel.find({}, null, {
        sort: {
            _id: -1
        }
    }, (err, docs) => {
        res.send({
            data: docs,
            params: req.query,
            status: 200
        });
    });
});
app.post('/api/web/form', (req, res) => {
    FormModel.create(req.body, (error, doc) => {
        res.send({
            data: doc,
            params: req.query,
            status: 200
        });
    });
});
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