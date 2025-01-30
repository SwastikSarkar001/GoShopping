import dotenv from 'dotenv';

const envPath = '.env.local'

// // Check if the environment is development
// const envPath = process.env.NODE_ENV === 'development' ? '.env.local' : '.env';

dotenv.config({ path: envPath });


const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
}

export const PORT = getEnv('PORT', '8080');
export const NODE_ENV = getEnv('NODE_ENV', 'development');
export const API_VERSION = getEnv('API_VERSION', 'v1');
export const MYSQL_HOST = getEnv('MYSQL_HOST');
export const MYSQL_USER = getEnv('MYSQL_USER')
export const MYSQL_PASSWORD = getEnv('MYSQL_PASSWORD')
export const MYSQL_DATABASE = getEnv('MYSQL_DATABASE')
export const APP_URL = getEnv('APP_URL')
export const ACCESS_TOKEN_SECRET = getEnv('ACCESS_TOKEN_SECRET')
export const REFRESH_TOKEN_SECRET = getEnv('REFRESH_TOKEN_SECRET')
export const ACCESS_TOKEN_EXPIRY = getEnv('ACCESS_TOKEN_EXPIRY')
export const REFRESH_TOKEN_EXPIRY = getEnv('REFRESH_TOKEN_EXPIRY')
export const REDIS_HOST = getEnv('REDIS_HOST')
export const REDIS_PORT = getEnv('REDIS_PORT')
export const REDIS_PASSWORD = getEnv('REDIS_PASSWORD')
export const EMAIL_APP_HOST = getEnv('EMAIL_APP_HOST')
export const EMAIL_APP_PASSWORD = getEnv('EMAIL_APP_PASSWORD')