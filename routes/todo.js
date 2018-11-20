const express = require('express');
var router = express.Router();
var todoModel = require('../models/todoModel');
var authorModel = require('../models/authorModel');
var validator = require('validator');

function isAuthenticated(req, res, next) {
  authorModel.find({ token: req.headers.authentication }).then(function (user) {
    if (user.lenght == 0) {
      res.json({ error: true, msg: 'Error: you must be logged in !'});
    }else{
      next();
    }
  });
}

router.get('/', isAuthenticated,function (req, res, next) {
  //return all todos
  todoModel.find().populate('author', '-password -email').exec((err, todos) => {
    if (err) {
      res.json({ error: true, msg: 'Error on getting todos. Error: ' + err, todos: null });
    }else{
      res.json({ error: false, msg:'Success on get all todos.', todos: todos });
    }
  });
});

router.get('/find/:_id', isAuthenticated,function (req, res, next) {
  if (req.params._id) {
    todoModel.findById(req.params._id).populate('author', '-password -email').exec((err, todo) =>{
      if (err) {
        res.json({ error: true, msg: 'Error on getting todo. Error: ' + err, todos: null });
      }else{
        res.json({ error: false, msg:'Success on get todo.', todos: todo });
      }
    });
  }else{
    res.json({error: true, msg: 'Error on getting todo, undefined id.', todos: null })
  }
});

router.delete('/delete/:_id', isAuthenticated,function (req, res, next) {
  if (req.params._id) {
    todoModel.findByIdAndDelete(req.params._id,(err, todo) => {
      if (err) {
        res.json({ error: true, msg: 'Error on delete todo. Error: ' + err, todos: null });
      }else{
        res.json({ error: false, msg: 'Success on delete todo.', todos: todo });
      }
    });
  }else{
    res.json({ error: true, msg: 'Error on getting todo, undefined id.', todos: null })
  }
});

router.put('/update', isAuthenticated,function (req, res, next) {
  if (!req.body.name || !req.body.description || !req.body.done ||
    req.body.name == '' || req.body.description == '' || !req.body._id) {
    res.json({ error: true, msg: 'Error on update todo, invalid data.', todos: null });
  }else{
    todoModel.findOneAndUpdate({ _id: req.body._id }, { $set: {
      name: req.body.name,
      description: req.body.description,
      done: req.body.done } }, (err, todo) =>{
        if (err) {
          res.json({ error: true, msg: 'Error on update todo. Error: ' + err, todos: null });
        }
        res.json({ error: false, msg: 'Success on update todo.', todos: todo });
    });
  }
});

router.post('/create', isAuthenticated,function (req, res, next) {
  if (!req.body.name || !req.body.description || !req.body.done ||
    req.body.name == '' || req.body.description == '' || !req.body.author) {
    res.json({ error: true, msg: 'Error on create todo, invalid data.', todos: null });
  }else{
    var todo = new todoModel(req.body);
    todo.save().then( todo => {
      res.json({ error: false, msg: 'Todo successfully created ', todos: todo });
    }).catch(err => {
      res.json({ error: true, msg: 'Error on create todo. Error: ' + err, todos: null });
    });
  }
});

module.exports = router;