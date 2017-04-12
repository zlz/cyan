const express = require('express');
const router = express.Router();
const path = require('path');
module.exports = (mgo) => {
    if (mgo.conn) {
        let Schema = new mgo.mongoose.Schema();
        let Model = mgo.conn.model('Login', Schema);
        router.get('/', (req, res, next) => {
                res.sendfile(path.join(__dirname, 'dist/views/login.htm'));
            })
            .post('/', (req, res, next) => {
                Model.create(req.body, (error, doc) => {
                    res.send({
                        data: {
                            name: req.body.name,
                            pswd: req.body.pswd
                        },
                        status: 200
                    });
                });
            });
        return router;
    }
};