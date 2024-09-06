const express = require('express');
const router = express.Router();
const {
  getWorkplace,
  editWorkplace,
  editWorkplaceName,
} = require('../controllers/workplaces');

router.get('/:userId', getWorkplace);
router.post('/:userId', editWorkplace);
router.post('/:userId/name', editWorkplaceName);

module.exports = router;
