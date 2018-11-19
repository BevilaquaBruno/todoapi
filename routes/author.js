const express = require('express');
var router = express.Router();
var authorModel = require('../models/authorModel');
var validator = require('validator');

router.get('/', function (req, res, next) {
  authorModel.find().select('-password').exec((err, author)=> {
    if (err) {
      res.json({ error: false, msg: 'Error on getting all authors. Error: ' + err, authors: null });
    }else{
      res.json({ error: false, msg: 'Success on getting all authors.', authors: author });
    }
  });
});

router.get('/find/:_id', function(req, res, next){
  if (req.params._id) {
    authorModel.findById(req.params._id, (err, author)=>{
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

router.delete('/delete/:_id', function (req, res, next) {
  if (req.params._id) {
    authorModel.findByIdAndDelete(req.params._id,(err, author) => {
      if (err) {
        res.json({ error: true, msg: 'Error on delete author. Error: ' + err, authors: null });
      }else{
        res.json({ error: false, msg: 'Success on delete author.', authors: author });
      }
    });
  }else{
    res.json({ error: false, msg: 'Error on delete author, id is undefined.', authors: null });
  }
});

router.put('/update', function (req, res, next) {
  var today = new Date();
  if (!req.body.name || !req.body.birthday || !req.body._id ||
    !req.body.username || !req.body.email ||
    req.body._id == '' || req.body.name == '' || req.body.birthday == '' ||
    validator.isBefore(today.toString(), req.body.birthday) ||
    req.body.username == '' || req.body.email == '') {
    res.json({ error: false, msg: 'Error on update author, invalid data.', authors: null });
  }else{
    authorModel.findOneAndUpdate({ _id: req.body._id }, { $set: {
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

router.post('/create', function (req, res, next) {
  var today = new Date();
  if (!req.body.name || !req.body.birthday ||
    !req.body.username  || !req.body.password  || !req.body.email ||
    req.body.name == '' || validator.isBefore(today.toString(), req.body.birthday) ||
    req.body.username == '' || req.body.password == '' || req.body.email == '') {
    res.json({ error: false, msg: 'Error on create author, invalid data.', authors: null });
  }else{
    delete req.body._id;
    var author = new authorModel(req.body);
    author.save().then( author => {
      res.json({ error: false, msg: 'Author successfully created ', authors: author });
    }).catch(err => {
      res.json({ error: true, msg: 'Error on create author. Error:' + err, authors: null });
    });
  }
});

module.exports = router;