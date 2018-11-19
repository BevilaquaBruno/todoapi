const express = require('express');
var router = express.Router();
var authorModel = require('../models/authorModel');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }else{
    res.json({ error: true, msg: 'Error: you must be logged in !'});
  }
}

router.post('/login', function(req, res, next){
  if (!req.body.username || !req.body.password ||
      req.body.username == '' || req.body.password == '') {
    res.json({ error: true, msg: 'Error on login, verify your username and password.' });
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
              req.session.user = user;
              delete req.session.user.password;
              req.session.user.logged = true;
              res.json({ error: false, msg: 'You are logged in now !' });
            }else{
              res.json({ error: true, msg: 'Error on login, username or password does not match.' });
            }
          }
        });
      }
    });
  }
});

router.get('/logoff', isAuthenticated ,function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.json({ error: true, msg: 'Error on logoff, Error: '+ err });
    }else{
      res.json({ error: false, msg: 'You are logged off now !' });
    }
  })
});

router.all('*', function (req, res, next) {
  res.json({ error: true, msg: 'Invalid route.' });
});

module.exports = router;