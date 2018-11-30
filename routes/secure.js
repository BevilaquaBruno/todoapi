const express = require('express');
var router = express.Router();
var authorModel = require('../models/authorModel');
var hash = require('object-hash');

function isAuthenticated(req, res, next) {
  authorModel.find({ token: req.headers.authentication }).then(function (user) {
    if (user.length == 0) {
      res.json({ error: true, msg: 'Error: you must be logged in !'});
    }else{
      next();
    }
  });
}

router.post('/login', function(req, res, next){
  if (!req.body.username || !req.body.password ||
      req.body.username == '' || req.body.password == '') {
    res.json({ error: true, msg: 'Error on login, verify your username and password.'});
  }else{
    authorModel.findOne({ username: req.body.username }, function (err, user) {
      if (err || user == null) {
        res.json({ error: true, msg: 'Error on login, username or password does not match.' });
      }else{
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (err) {
            res.json({ error: true, msg: 'Error on login, server error, try again later.' });
          }else{
            if (isMatch) {
              authorModel.findOneAndUpdate({ _id: user._id }, { $set:{ token: hash(user.username+user.email+user.description) }}).select('-password').then(function (user2) {
                if (user2) {
                  res.json({ error: false, msg: 'You are logged in now !' , user: user2});
                }else{
                  res.json({ error: false, msg: 'Erro on login!' , user: null});
                }
              });
            }else{
              res.json({ error: true, msg: 'Error on login, username or password does not match.' });
            }
          }
        });
      }
    });
  }
});

router.get('/logout', isAuthenticated ,function (req, res, next) {
  authorModel.findOneAndUpdate({ token: req.headers.authentication }, { $set: { token: 'no token' }}).then(function (user) {
    if (!user) {
      res.json({ error: true, msg: 'Error on logout, Error: ' + user});
    }else{
      res.json({ error: false, msg: 'You are logged off now !'});
    }
  });
});

router.get('/verify',isAuthenticated, function (req, res, next) {
  authorModel.find({ token: req.headers.authentication }).then(function (user) {
    if (user.length == 0) {
      res.json({ error: true, msg: 'Error: you must be logged in !', user: null});
    }else{
      res.json({ error: false, msg: 'You are logged !', user: user});
    }
  });
})
module.exports = router;