const express = require('express');
const router = express.Router();
const { getWorkplace, editWorkplace } = require('../controllers/workplaces');

router.get('/:userId', getWorkplace);
router.post('/:userId', editWorkplace);

module.exports = router;
