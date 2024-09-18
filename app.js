//Libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const functions = require('firebase-functions');
// Routes
const router = require('./routes/index');
// Middleware
const { requestLogger, errorLogger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const pageNotExist = require('./middleware/pageNotExist');

dotenv.config();

const { SERVER_PORT, NODE_ENV } = process.env;

app = express();

app.use(helmet());
app.use(rateLimiter);
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
app.use('/api', router);
app.use('*', pageNotExist);
app.use(errorLogger);
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`Port: ${SERVER_PORT}, Enviroment: ${NODE_ENV}`);
});

exports.api = functions.https.onRequest(app);
