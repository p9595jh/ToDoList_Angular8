var express = require('express');
var router = express.Router();
// =================================
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

router.get('/', function(req, res, next) {
  User.find({}, {userid: 1, email: 1}, (err, users) => {
    if ( err ) res.status(500).json(err);
    else res.json(users);
  });
});

router.post('/', (req, res, next) => {
  const newUser = new User({
    userid: req.body.userid,
    email: req.body.email,
    password: req.body.password
  });

  User.addUser(newUser, (err, user) => {
    if ( err ) res.status(500).json({success: false, msg: 'Failed to register user', err: err})
    else res.status(201).json({success: true, msg: 'User registered'})
  });
});

router.post('/authenticate', (req, res, next) => {
  const userid = req.body.userid;
  const password = req.body.password;
  
  User.getUserByUserId(userid, (err, user) => {
    if ( err ) throw err;
    else if ( !user ) {
      return res.json({success: false, msg: 'User not found'});
    }
    
    User.comparePassword(password, user.password, (err, isMatch) => {
      // if(err) throw err;
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
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json(req.user);
});

router.get('/:userid', (req, res, next) => {
  User.findOne({userid: req.params.userid}, (err, user) => {
    if ( err ) res.status(500).json(err);
    else if ( !user ) res.json({msg: 'User not found'});
    else res.json(user);
  });
});

module.exports = router;
