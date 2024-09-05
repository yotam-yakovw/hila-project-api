const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const client = require('../redis/client');

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
    const userHash = await client.hGetAll(`user:${userId}`);
    const isCorrect = await bcrypt.compare(password, userHash.password);

    if (isCorrect) {
      delete userHash.password;
      userHash.id = userId;
      res.status(200).send(userHash);
      return;
    }
  }
  res.status(404).send('Incorrect email or password');
});

module.exports = router;
