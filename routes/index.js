const express = require('express');
var router = express.Router();

router.all('/', function (req, res, next) {
  res.json({ error: false, msg: 'use /todo or /author.' });
})

module.exports = router;