const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('../redis/client');

router.get('/', async (req, res) => {
  res.send('Hello User: ' + req.body.user);
});

router.post('/signup', async (req, res) => {
  const { email, password, workplace, isAdmin } = req.body;

  const userId = await client.get('user:id');

  const isNew = await client.zAdd(
    'users',
    {
      value: email,
      score: userId,
    },
    { NX: true }
  );

  if (isNew) {
    client.incr('user:id');
    const hash = await bcrypt.hash(password, 12);
    const redis = await client.hSet(`user:${userId}`, {
      email,
      password: hash,
      workplace,
      isAdmin,
    });

    res.status(200).send('User created!');
  } else {
    res.status(400).send('User already exists!');
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const userId = await client.zScore('users', email);

  if (userId) {
    const hash = await client.hGet(`user:${userId}`, 'password');
    const isCorrect = await bcrypt.compare(password, hash);

    if (isCorrect) {
      res.status(200).send('OK');
      return;
    }
  }
  res.status(404).send('Incorrect email or password');
});

module.exports = router;
