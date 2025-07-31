import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secure-secret-key',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mediVault',
};