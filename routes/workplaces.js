const express = require('express');
const router = express.Router();
const {
  getWorkplace,
  editWorkplace,
  editWorkplaceName,
} = require('../controllers/workplaces');

router.get('/', getWorkplace);
router.post('/', editWorkplace);
router.post('/name', editWorkplaceName);

module.exports = router;
