import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responses.js';
import { comparePassword, createAccessToken, generateHashedPassword } from '../utils/auth.js';
import logger from '../utils/logger.js';
import { StatusCodes } from 'http-status-codes';

export const register = async (req, res, next) =>{
	try {
		logger.info("START: Register Account Service")
		const { firstName, lastName, email, password, role } = req.validatedUser;

		const existingUser = await User.findOne({$or: [ {email} ]});
		
		if(existingUser){
			return errorResponse(res, StatusCodes.BAD_REQUEST, "User already exists");
		};
		const user = await User.create({
			firstName,
			lastName,
			email,
			password : generateHashedPassword(password),
			role
		});

		const accessToken = createAccessToken(user.id);
		logger.info("END: Register Account Service");
		return successResponse(res, StatusCodes.CREATED, "User created successfully", {accessToken});
	} catch (error) {
		// if(error.code === 11000){
		// 	logger.error("User already exists");
		// 	next(error);
		// 	return errorResponse(res, StatusCodes.CONFLICT, "User already exists");
		// }
		logger.error(error.message);
		next(error);
	}
};

export const login = async (req, res, next) =>{
	try {
		logger.info("START: Login Service");

		const { email, password } = req.body;

		if (!email || !password){
			logger.error("Email and Password are required");

			return errorResponse(res,  StatusCodes.UNPROCESSABLE_ENTITY, "missing parameter(s): input password and username");
		};
		const user = await User.findOne({email});

		if(!user){
			logger.info("END: Login Service");

			return errorResponse(res, StatusCodes.NOT_FOUND, "User not found, create new account");
		};

		if(!comparePassword(password, user.password)){
			logger.info("END: Login Service");

			return errorResponse(res, StatusCodes.BAD_REQUEST, "Invalid Password");
		}
		const accessToken = createAccessToken(user.id);

		logger.info("END: Login Service");
		return successResponse(res, StatusCodes.ACCEPTED, "Login successful", {accessToken});
	}
	catch(error){
		logger.error(error.message);
		next(error);
	}
};

export const resetPassword = async (req, res, next) =>{
	try {
		logger.info("START: Reset Password Service");
		const { newPassword } = req.body;

		const user = await User.findOne({email});

		if(!user){
			logger.info("END: Reset Password Service");

			return errorResponse(res, StatusCodes.NOT_FOUND, "User not found, create new account");
		};

		user.password = generateHashedPassword(newPassword);
		await user.save();

		logger.info("END: Reset Password Service");
		return successResponse(res, StatusCodes.ACCEPTED, "Password reset successful");

	} catch (error) {
		logger.error(error.message);
		next(error);
	}

};