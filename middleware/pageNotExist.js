module.exports = (req, res, next) => {
  const err = new Error('This page does not exist!');
  err.statusCode = 404;
  next(err);
};
