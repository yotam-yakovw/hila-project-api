const express = require('express');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');
const workplaceRouter = require('./workplaces');
const userRouter = require('./users');
const { signUpRequest, signUp, signIn } = require('../controllers/users');

router.post('/signupreq', signUpRequest);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.use('/workplaces', jwtAuth, workplaceRouter);
router.use('/users', jwtAuth, userRouter);

module.exports = router;
