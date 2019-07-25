var express = require('express');
var router = express.Router();
// =================================
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

router.get('/', async function(req, res, next) {
  try {
    const users = await User.find({}, {userid: 1, email: 1});
    res.json(users);
  } catch(err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res, next) => {
  const newUser = new User({
    userid: req.body.userid,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const user = await User.addUser(newUser);
    res.status(201).json({success: true, msg: 'User registered'});
  } catch(err) {
    res.status(500).json({success: false, msg: 'Failed to register user', err: err});
  }
});

router.post('/authenticate', async (req, res, next) => {
  const userid = req.body.userid;
  const password = req.body.password;

  try {
    const user = await User.findOne({userid: userid});
    const isMatch = await User.comparePassword(password, user.password);
    if ( isMatch ) {
      const token = jwt.sign({data: user}, config.secret, {
        expiresIn: 604800  // 1 week in seconds
      });
      res.json({
        success: true,
        token: 'JWT ' + token,
        user: {
          _id: user._id,
          userid: user.userid,
          email: user.email
        }
      });
    } else {
      res.json({success: false, msg: 'Wrong password'});
    }

  } catch(err) {
    res.json({success: false, msg: 'Wrong password or user not found'});
  }
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json(req.user);
});

router.get('/:userid', async (req, res, next) => {
  try {
    const user = await User.findOne({userid: req.params.userid});
    res.json(user);
  } catch(err) {
    res.json({msg: 'User not found'});
  }
});

module.exports = router;
