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
const pageNotExist = require('./middleware/pageNotExist');

const { PORT, NODE_ENV } = process.env;

app = express();

app.use(helmet());
app.use(rateLimiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
app.use('/', router);
app.use('*', pageNotExist);
app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Port: ${PORT}, Enviroment: ${NODE_ENV}`);
});
