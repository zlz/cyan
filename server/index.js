const express = require('express');
const router = express.Router();
const path = require('path');
const phantom = require('phantom');
router.get('/', (req, res, next) => {
    const ua = req.headers['user-agent'];
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const pattern = /Googlebot|Googlebot-News|Googlebot-Image|Googlebot-Video|Googlebot-Mobile|Mediapartners-Google|Mediapartners|AdsBot-Google|AdsBot-Google-Mobile-Apps/i;
    let isRobot = pattern.test(ua);
    if (isRobot) {
        console.log('bot');
        let sitepage = null;
        let phInstance = null;
        phantom.create()
            .then((instance) => {
                phInstance = instance;
                return instance.createPage();
            })
            .then((page) => {
                sitepage = page;
                return page.open(fullUrl);
            })
            .then(() => {
                return sitepage.property('content');
            })
            .then((content) => {
                console.log(content);
                res.send(content);
                sitepage.close();
                phInstance.exit();
            })
            .catch(function(error) {
                console.log(error);
                phInstance.exit();
            });
    } else {
        res.sendfile(path.join(__dirname, '../static/index.html'));
    }
});
module.exports = router;