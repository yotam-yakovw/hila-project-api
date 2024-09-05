const express = require('express');
const cors = require('cors');
const users = require('./routes/users');
const workplaces = require('./routes/workplaces');

const { PORT } = process.env;

app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', users);
app.use('/workplaces', workplaces);

app.get('/', (req, res) => {
  res.send('Test Text');
});

app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});
