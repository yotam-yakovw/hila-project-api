const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello User: ' + req.body.user);
});

module.exports = router;
