const express = require('express');
const router = express.Router();
module.exports = (mgo) => {
    if (mgo.conn) {
        let Schema = new mgo.mongoose.Schema();
        let Model = mgo.conn.model('Common', Schema);
        router.get('/', (req, res, next)=> {
            if (req.query.lang) {
                Model.find({}, {
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
        return router;
    }
};