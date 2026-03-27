import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || '';

export const connectDB = async (): Promise<void> => {
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }
  await mongoose.connect(uri);
};
