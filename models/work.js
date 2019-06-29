const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// Work Schema
const WorkSchema = mongoose.Schema({
    date: String,
    work: String,
    userid: String
});

const Work = module.exports = mongoose.model('Work', WorkSchema);

module.exports.addWork = (newWork, callback) => {
    newWork.save(callback);
}
