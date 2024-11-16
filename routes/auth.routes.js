import express from 'express';
import { loginValidation, signUpValidation, resetPasswordValidation } from '../middleware/authValidator.js';
import { register, login, resetPassword, logout } from '../controllers/auth.controller.js';
import isLoggedIn from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register', signUpValidation, register);
authRouter.post('/login', loginValidation, login);
authRouter.post('/reset-password', resetPasswordValidation, resetPassword);
authRouter.get('/logout', logout);

export default authRouter;