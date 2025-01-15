import morgan, { StreamOptions } from 'morgan'
import logger from 'utils/logger'; // Import the Winston logger

// Create a stream to pipe Morgan logs to Winston
const stream: StreamOptions = {
  write: (message) => logger.trac(message.trim()),
};

// Skip logging during tests
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

// Build the morgan middleware
const logHandler = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export default logHandler;