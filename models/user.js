const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.addUser = async (newUser) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;
  return newUser.save();
}

module.exports.comparePassword = async (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
}
