const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/cyan');
let conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', () => {
    console.log('MongoDB Opened!');
});
module.exports = {
    mongoose: mongoose,
    conn: conn
};
