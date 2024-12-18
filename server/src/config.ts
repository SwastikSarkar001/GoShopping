import dotenv from 'dotenv';

const envPath = '.env.local'

// // Check if the environment is development
// const envPath = process.env.NODE_ENV === 'development' ? '.env.local' : '.env';

dotenv.config({ path: envPath });