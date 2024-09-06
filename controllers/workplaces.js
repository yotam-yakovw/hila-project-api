const client = require('../redis/client');

module.exports.getWorkplace = async (req, res, next) => {
  const { userId } = req.params;

  const data = await client.json.get(`workplace:${userId}`);

  try {
    if (!data) {
      const err = new Error('No data was found for this ID');
      err.statusCode = 400;
      throw err;
    }

    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};

module.exports.editWorkplace = async (req, res, next) => {
  const { userId } = req.params;
  const { workers, locations, notes } = req.body;

  const redis = await client.json.set(`workplace:${userId}`, '$', {
    workers,
    locations,
    notes,
  });

  try {
    if (redis !== 'OK') {
      throw new Error('Update have failed!');
    }

    res.status(200).send('Update was successful');
  } catch (err) {
    next(err);
  }
};
