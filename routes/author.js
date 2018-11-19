const express = require('express');
var router = express.Router();
var authorModel = require('../models/authorModel');
var validator = require('validator');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }else{
    res.json({ error: false, msg: 'Error: you must be logged in !'});
  }
}

router.get('/', isAuthenticated,function (req, res, next) {
  authorModel.find().select('-password').exec((err, author)=> {
    if (err) {
      res.json({ error: false, msg: 'Error on getting all authors. Error: ' + err, authors: null });
    }else{
      res.json({ error: false, msg: 'Success on getting all authors.', authors: author });
    }
  });
});

router.get('/find/:_id', isAuthenticated,function (req, res, next){
  if (req.params._id) {
    authorModel.findById(req.params._id,'-password').exec((err, author)=>{
      if (err) {
        res.json({ error: false, msg: 'Error on getting author. Error: ' + err, authors: null });
      }else{
        res.json({ error: false, msg: 'Success on getting author.', authors: author });
      }
    });
  }else{
    res.json({ error: false, msg: 'Error on getting author, id is undefined.', authors: null });
  }
});

router.delete('/delete/:_id', isAuthenticated,function (req, res, next) {
  if (req.params._id) {
    authorModel.findByIdAndDelete(req.params._id,(err, author) => {
      if (err) {
        res.json({ error: true, msg: 'Error on delete author. Error: ' + err, authors: null });
      }else{
        if (author == null) {
          res.json({ error: true, msg: 'This author have been deleted before.', authors: author });
        }else{
          res.json({ error: false, msg: 'Success on delete author.', authors: author });
        }
      }
    });
  }else{
    res.json({ error: false, msg: 'Error on delete author, id is undefined.', authors: null });
  }
});

router.put('/update', isAuthenticated,function (req, res, next) {
  var today = new Date();
  if (!req.body.name || !req.body.birthday || !req.body._id ||
    !req.body.username || !req.body.email ||
    req.body._id == '' || req.body.name == '' || req.body.birthday == '' || !validator.isEmail(req.body.email) ||
    validator.isBefore(today.toString(), req.body.birthday) ||
    req.body.username == '' || req.body.email == '') {
    res.json({ error: false, msg: 'Error on update author, invalid data.', authors: null });
  }else{
    authorModel.findOneAndUpdate({ _id: req.body._id }, { $set: {
      _id: req.body._id,
      name: req.body.name,
      username: req.body.username,
      birthday: req.body.birthday,
      description: req.body.description,
      email: req.body.email } }, (err, author) =>{
        if (err) {
          res.json({ error: true, msg: 'Error on update author. Error: ' + err, authors: null });
        }else{
          res.json({ error: false, msg: 'Success on update author.', authors: author });
        }
    });
  }
});

router.post('/create', isAuthenticated,function (req, res, next) {
  var today = new Date();
  if (!req.body.name || !req.body.birthday ||
    !req.body.username  || !req.body.password  || !req.body.email ||
    req.body.name == '' || validator.isBefore(today.toString(), req.body.birthday) || !validator.isEmail(req.body.email) ||
    req.body.username == '' || req.body.password == '' || req.body.email == '') {
    res.json({ error: false, msg: 'Error on create author, invalid data.', authors: null });
  }else{
    delete req.body._id;
    var author = new authorModel(req.body);
    author.save().then( author => {
      res.json({ error: false, msg: 'Author successfully created ',
      authors: {
        _id: author._id,
        username: author.username,
        email: author.email,
        name: author.name,
        description: author.description,
        birthday: author.birthday} });
    }).catch(err => {
      res.json({ error: true, msg: 'Error on create author. Error:' + err, authors: null });
    });
  }
});

router.all('*', function (req, res, next) {
  res.json({ error: true, msg: 'Invalid route.' });
});

module.exports = router;