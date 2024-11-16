import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is undefined. Check your .env file.");
  process.exit(1);
}

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB Connected`);
  } catch (err) {
    logger.error(err.message);
    process.exit(1);
  }
};

export default connectDb;
