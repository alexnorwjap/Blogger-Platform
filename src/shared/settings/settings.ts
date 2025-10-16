import dotenv from 'dotenv';

dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 5006,
  MONGO_URL: process.env.MONGO_URL || 'wrong-mongo-url',
  DB_NAME: process.env.DB_NAME || 'wrong-db-name',
  JWT_SECRET: process.env.JWT_SECRET || 'wrong-jwt-secret',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'wrong-admin-username',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'wrong-admin-password',
  EMAIL_USER: process.env.EMAIL_USER || 'wrong-email-user',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'wrong-email-password',
};
