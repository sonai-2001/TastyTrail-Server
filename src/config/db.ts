import mongoose from 'mongoose';
import logger from './logger';

export default async function connectDB(uri: string) {
  try {
    if (!uri) throw new Error('MONGO_URI is not defined in environment variables');

    await mongoose.connect(uri);
    logger.info('MongoDB connected');
    console.log('MongoDB connected');
  } catch (err: any) {
    logger.error(`MongoDB connection error: ${err.message}`, { stack: err.stack });
    throw err;
  }
}
