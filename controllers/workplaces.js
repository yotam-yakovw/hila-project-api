const client = require('../redis/client');

module.exports.getWorkplace = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  if (!userId) {
    res.status(400).send('user id not provided!');
    return;
  }

  const data = await client.json.get(`workplace:${userId}`);

  if (!data) {
    res.status(404).send('No data was found for this user id');
    return;
  }

  res.status(200).send(data);
};

module.exports.editWorkplace = async (req, res) => {
  const { userId } = req.params;
  const { workers, locations, notes } = req.body;

  const redis = await client.json.set(`workplace:${userId}`, '$', {
    workers,
    locations,
    notes,
  });

  if (redis === 'OK') {
    res.status(200).send('Operation was successful');
    return;
  }

  res.status(500).send('Operation failed!');
};
