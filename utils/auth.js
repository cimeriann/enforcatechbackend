import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

const { genSaltSync, hashSync, compareSync } = bcryptjs;
const { sign, verify } = jwt;
const jwt_secret = process.env.JWT_SECRET;
configDotenv();

export const generateHashedPassword = (password) => {
	const salt = genSaltSync(10);
	return hashSync(password, salt);
};

export const comparePassword = (password, hashedPassword) => {
	return compareSync(password, hashedPassword);
};

export const createAccessToken = (id) => {
	const token = sign({id}, jwt_secret, {expiresIn: '1h'});
	return token;
};

export const isTokenValid = (token) => {
	return verify(token, jwt_secret);
};
