const express = require('express');
const router = express.Router();
module.exports = (mgo) => {
    if (mgo.conn) {
        let CommonSchema = new mgo.mongoose.Schema();
        let CommonModel = mgo.conn.model('Common', CommonSchema);
        router.get('/', function(req, res, next) {
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
        return router;
    }
};