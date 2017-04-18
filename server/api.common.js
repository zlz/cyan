const express = require('express');
const router = express.Router();
module.exports = (mgo) => {
    if (mgo.conn) {
        let Schema = new mgo.mongoose.Schema();
        let Model = mgo.conn.model('Common', Schema);
        router.get('/', (req, res, next) => {
            Model.find((err, docs) => {
                res.send({
                    data: docs[0],
                    params: req.query,
                    status: 200
                });
            });
        });
        return router;
    }
};