const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      const err = new Error(
        'Authorization not provided or provided without Bearer'
      );
      err.statusCode = 403;
      throw err;
    }

    const { JWT_SECRET } = process.env;
    const token = authorization.replace('Bearer ', '');

    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload) {
      const err = new Error('You are not authorized!');
      err.statusCode = 401;
      throw err;
    }

    console.log(payload.id);

    req.userId = payload.id;
    next();
  } catch (err) {
    next(err);
  }
};
