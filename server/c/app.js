const express = require('express');
const router = express.Router();
const path = require('path');
const phantom = require('phantom');
router.get('/', (req, res, next) => {
    const ua = req.headers['user-agent'];
    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '#!' + req.cookies.current_hash;
    const pattern = /Googlebot|Googlebot-News|Googlebot-Image|Googlebot-Video|Googlebot-Mobile|Mediapartners-Google|Mediapartners|AdsBot-Google|AdsBot-Google-Mobile-Apps|Baiduspider|bingbot/i;
    let isRobot = pattern.test(ua);
    if (isRobot) {
        console.log(fullUrl);
        let sitepage = null;
        let phInstance = null;
        phantom
            .create()
            .then(instance => {
                phInstance = instance;
                return instance.createPage();
            })
            .then(page => {
                sitepage = page;
                return page.open(fullUrl);
            })
            .then(() => {
                return sitepage.property('content');
            })
            .then(content => {
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
        res.sendfile(path.join(__dirname, '../../static/c/app.htm'));
    }
});
module.exports = router;
