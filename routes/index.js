const express = require('express');
const router = express.Router();
const workplaceRouter = require('./workplaces');
const userRouter = require('./users');
const { signUp, signIn } = require('../controllers/users');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.use('/workplaces', workplaceRouter);
router.use('/users', userRouter);

module.exports = router;
