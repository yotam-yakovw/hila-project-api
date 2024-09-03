const { createClient } = require('redis');
const { REDIS_PW, REDIS_HOST, REDIS_PORT } = process.env;

const client = createClient({
  password: REDIS_PW,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

client.on('error', (err) => console.log('Redis Error: ', err));

if (!client.isOpen) {
  client.connect();
  console.log('Redis client connected');
}

module.exports = client;
