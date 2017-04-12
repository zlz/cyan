const express = require('express');
const router = express.Router();
module.exports = (mgo) => {
    if (mgo.conn) {
        let AlbumSchema = new mgo.mongoose.Schema();
        let AlbumModel = mgo.conn.model('Album', AlbumSchema);
        router.get('/', function(req, res, next) {
            AlbumModel.find((err, docs) => {
                res.send({
                    data: docs,
                    params: req.query,
                    status: 200
                });
            });
        });
        return router;
    }
};