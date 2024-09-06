const bcrypt = require('bcrypt');
const client = require('../redis/client');

module.exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await client.hGetAll(`user:${userId}`);

  try {
    if (!user.email) {
      const err = new Error('Requested user could not be found!');
      err.statusCode = 404;
      throw err;
    }
    delete user.password;
    user.id = userId;

    res.status(200).send(user);
    return;
  } catch (err) {
    next(err);
  }
};

module.exports.signUp = async (req, res, next) => {
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

  try {
    if (!isNew) {
      const err = new Error('User already exists!');
      err.statusCode = 400;
      throw err;
    }

    const hash = await bcrypt.hash(password, 12);
    const redis = await client.hSet(`user:${userId}`, {
      email,
      password: hash,
      workplace,
      isAdmin,
    });

    if (redis !== 'OK') {
      throw new Error('User could not be created!');
    }

    client.incr('user:id');
    res.status(200).send('User created!');
  } catch (err) {
    next(err);
  }
};

module.exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const userId = await client.zScore('users', email);
  const passMatch = await bcrypt.compare(password, userHash.password);

  try {
    if (!userId || !passMatch) {
      const err = new Error('Incorrect email or password');
      err.statusCode = 404;
      throw err;
    }

    const userHash = await client.hGetAll(`user:${userId}`);

    delete userHash.password;
    userHash.id = userId;
    res.status(200).send(userHash);
  } catch (err) {
    next(err);
  }
};
