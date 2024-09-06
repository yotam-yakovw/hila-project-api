module.exports = (err, req, res, next) => {
  const { statusCode = 500, message = 'Server encountered an error!' } = err;

  res.status(statusCode).send(`Error: ${message}`);
};
