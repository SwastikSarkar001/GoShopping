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
export const MYSQL_HOST = getEnv('MYSQL_HOST');
export const MYSQL_USER = getEnv('MYSQL_USER')
export const MYSQL_PASSWORD = getEnv('MYSQL_PASSWORD')
export const MYSQL_DATABASE = getEnv('MYSQL_DATABASE')