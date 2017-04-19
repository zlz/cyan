const express = require('express');
const path = require('path');
const router = express.Router();
router.get('/', (req, res, next) => {
    res.sendfile(path.join(__dirname, '../../static/b/app.htm'));
});
module.exports = router;