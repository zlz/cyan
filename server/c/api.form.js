const express = require('express');
const router = express.Router();
module.exports = (mgo) => {
    if (mgo.conn) {
        let Schema = new mgo.mongoose.Schema({
            email: 'String',
            qq: 'Number',
            msg: 'String',
            name: 'String'
        });
        let Model = mgo.conn.model('Form', Schema);
        router.get('/', (req, res, next) => {
                Model.find({}, null, {
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
            })
            .post('/', (req, res, next) => {
                Model.create(req.body, (error, doc) => {
                    res.send({
                        data: doc,
                        params: req.query,
                        status: 200
                    });
                });
            });
        return router;
    }
};