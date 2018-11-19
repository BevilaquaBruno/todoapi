const express = require('express');
var router = express.Router();

router.all('/', function (req, res, next) {
  res.json({ error: false, msg: 'use /todo, /author or /login.' });
})

module.exports = router;