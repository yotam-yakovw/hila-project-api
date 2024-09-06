const bcrypt = require('bcrypt');
const client = require('../redis/client');

module.exports.getUser = async (req, res) => {
  const { userId } = req.params;

  const user = await client.hGetAll(`user:${userId}`);

  if (user.email) {
    delete user.password;
    user.id = userId;

    res.status(200).send(user);
    return;
  }
  res.status(404).send('requested user could not be found!');
};

module.exports.signUp = async (req, res) => {
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
    const hash = await bcrypt.hash(password, 12);
    const redis = await client.hSet(`user:${userId}`, {
      email,
      password: hash,
      workplace,
      isAdmin,
    });

    if (redis === 'OK') {
      client.incr('user:id');
      res.status(200).send('User created!');
      return;
    }

    res.status(500).send('User could not be created!');
  } else {
    res.status(400).send('User already exists!');
  }
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  const userId = await client.zScore('users', email);
  const passMatch = await bcrypt.compare(password, userHash.password);

  if (userId && passMatch) {
    const userHash = await client.hGetAll(`user:${userId}`);

    delete userHash.password;
    userHash.id = userId;
    res.status(200).send(userHash);
    return;
  }
  res.status(404).send('Incorrect email or password');
};
