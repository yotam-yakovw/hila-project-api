//Libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// Routes
const router = require('./routes/index');
// Middleware
const { requestLogger, errorLogger } = require('./middleware/logger');

const { PORT } = process.env;

app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);
app.use('/', router);
app.use('*', (req, res) => {
  res.status(404).send('Page does not exist!');
});
app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});
