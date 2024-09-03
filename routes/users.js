const express = require('express');
const router = express.Router();
const client = require('../redis/client');

router.get('/', (req, res) => {
  res.send('Hello User: ' + req.body.user);
  client.set('user', req.body.user);
});

module.exports = router;
