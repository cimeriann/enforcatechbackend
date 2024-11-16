import express from 'express';
import { loginValidation, signUpValidation } from '../middleware/authValidator.js';
import { register, login, resetPassword } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/register', signUpValidation, register);
authRouter.post('/login', loginValidation, login);
authRouter.post('/reset-password', resetPasswordValidation, resetPassword);

export default authRouter;