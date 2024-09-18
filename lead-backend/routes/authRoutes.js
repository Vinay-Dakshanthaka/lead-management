const express = require('express');
const authController = require('../controller/authContorller');
const authRouter = express.Router();
const authenticateToken  = require('../middlewares/authenticateToken')

authRouter.post('/sign-up', authController.signUp);

authRouter.post('/signUpWithDummyPassword',authenticateToken, authController.signUpWithDummyPassword);

authRouter.post('/updatePassword',authenticateToken, authController.updatePassword);

authRouter.post('/sign-in', authController.signIn);

authRouter.post('/password-reset-email', authController.sendPasswordResetEmail);

authRouter.post('/reset-password', authController.resetPassword);

// authRouter.post('/sign-out', authController.signOut);

module.exports = authRouter;
