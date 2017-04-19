const express = require('express');
const router = express.Router();
const path = require('path');
module.exports = (mgo) => {
    if (mgo.conn) {
        let Schema = new mgo.mongoose.Schema({
            name: 'String',
            pswd: 'String'
        });
        let Model = mgo.conn.model('User', Schema);
        router.post('/', (req, res, next) => {
            Model.find({
                name: req.body.name,
                pswd: req.body.pswd
            }, (err, docs) => {
                if (docs.length > 0) {
                    res.send({
                        data: docs[0],
                        msg: '登录成功！',
                        status: 0
                    });
                } else {
                    res.send({
                        data: docs[0],
                        msg: '用户名或密码错误！',
                        status: 1003
                    });
                }
            });
        });
        return router;
    }
};