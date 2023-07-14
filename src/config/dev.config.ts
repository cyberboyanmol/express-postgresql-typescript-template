import dotenv from 'dotenv';
import { Config } from '@/interfaces/config.interface';
dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

export const devConfig: Config = {
  env: String(process.env.NODE_ENV || 'development'),
  server: {
    host: String(process.env.HOST) || 'localhost',
    port: Number(process.env.PORT) || 8080,
  },
  log: {
    format: 'dev',
    level: 'debug',
  },
  allowedOrigins: ['http://localhost:3000'],

  ARGON_SECRET_PEPPER: String(process.env.ARGON_SECRET_PEPPER),
  // jwt tokens
  JWT_ACCESS_TOKEN_EXPIRATION: String(process.env.JWT_ACCESS_TOKEN_EXPIRATION),
  JWT_REFRESH_TOKEN_EXPIRATION: String(process.env.JWT_REFRESH_TOKEN_EXPIRATION),
  JWT_REFRESH_TOKEN_COOKIE_EXPIRATION: Number(process.env.JWT_REFRESH_TOKEN_COOKIE_EXPIRATION),

  // smtp
  SMTP_SERVICE: String(process.env.SMTP_SERVICE),
  SMTP_SERVICE_EMAIL: String(process.env.SMTP_SERVICE_EMAIL),
  SMTP_SERVICE_PASSWORD: String(process.env.SMTP_SERVICE_PASSWORD),
  OTP_EXPIRE_IN_TIME: Number(process.env.OTP_EXPIRE_IN_TIME),
};
