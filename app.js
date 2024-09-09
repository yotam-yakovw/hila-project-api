//Libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// Routes
const router = require('./routes/index');
// Middleware
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const { PORT } = process.env;

app = express();

app.use(helmet());
app.use(rateLimiter);
app.use(cors());
app.options('*', cors());
app.app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
app.use('/', router);
app.use('*', (req, res) => {
  throw new Error({ message: 'not exist' });
});
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});
