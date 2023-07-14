import { CorsOptions } from 'cors';

export interface Config {
  env: string;
  server: {
    host: string;
    port: number;
  };
  log: {
    format: 'combined' | 'common' | 'dev' | 'short' | 'tiny';
    level: 'error' | 'warn' | 'info' | 'http' | 'debug';
  };
  allowedOrigins: Array<string>;

  ARGON_SECRET_PEPPER: string;
  JWT_ACCESS_TOKEN_EXPIRATION: string;
  JWT_REFRESH_TOKEN_EXPIRATION: string;
  JWT_REFRESH_TOKEN_COOKIE_EXPIRATION: number;
  SMTP_SERVICE: string;
  SMTP_SERVICE_EMAIL: string;
  SMTP_SERVICE_PASSWORD: string;
  OTP_EXPIRE_IN_TIME: number;
}
