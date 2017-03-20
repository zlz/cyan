const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const express = require('express');
const app = express();
const port = 80;
const proxy = require('http-proxy-middleware');
app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use('/', express.static(path.join(__dirname, 'dist'), {
    'index': ['index.html', 'index.htm', 'app.htm']
}));
app.use(['/api/admin', '/api/web'], proxy({
    target: 'http://127.0.0.1:9090',
    changeOrigin: false
}));
app.use('/api/sho', proxy({
    target: 'http://route.showapi.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api/sho': ''
    },
    logLevel: 'info'
}));
app.use(['/project', '/sso', '/authManage', '/indexController', '/globalPermissionManage', '/systemDDL', '/treeController'], proxy({
    target: 'http://192.168.32.33:9080',
    changeOrigin: false,
    logLevel: 'info'
}));
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.listen(port, function() {
});
module.exports = app;