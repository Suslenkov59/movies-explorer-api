const userRouter = require('express').Router();

const { getUserProfile, updateProfile } = require('../controllers/user');
const { validationUpdateProfile } = require('../utils/joi-validation');

userRouter.get('/me', getUserProfile);
userRouter.patch('/me', validationUpdateProfile, updateProfile);

module.exports = userRouter;
