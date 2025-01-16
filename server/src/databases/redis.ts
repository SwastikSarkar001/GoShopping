import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from 'constants/env'
import logger from 'utils/logger'
import Redis from 'ioredis'

const redis = new Redis({
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT),
  password: REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 5000, 120000)
    return delay
  }
})

let retryAttempts = 0

redis.on('connect', () => {
  console.log('Redis client connected')
  logger.info('Redis Client is connected with Redis Server.')
})

redis.on('ready', async () => {
  /* Check whether Redis is running */
  const pingResult = await redis.ping();
  console.log('Redis Ping Result:', pingResult);
  
  /* In case of reconnection show the status */
  if (retryAttempts > 0) {
    console.log('Number of reconnection attempts:', retryAttempts)
    retryAttempts = 0
  }

  logger.info('Redis Client is now ready to accept commends.')
  
  /* Synchronize Redis with MySQL data */
  let cursor = '0'
  let values = []
  let totkeys = []
  do {
    const [newCursor, keys] = await redis.scan(cursor, 'MATCH', 'users:*');
    cursor = newCursor;
    for (const key of keys) {
      totkeys.push(key.replace('users:', ''))
      const value: string = await redis.call('json.get', key) as string;
      if (value) {
        values.push(JSON.parse(value));
      }
    }
  } while (cursor !== '0');
  console.log(totkeys)

  /* Finally display that Redis is ready to accept commands */
  console.log('Redis client is ready to accept commands')
})

redis.on('error', (err) => {
  console.error('Redis client error:', err)
  logger.warn('Redis Client has encountered an issue while connecting to Redis Server.')
})

redis.on('end', () => {
  console.log('Redis client disconnected')
})

redis.on('reconnecting', (delay: number) => {
  const seconds = Math.floor(delay / 1000)
  const sec = seconds % 60
  const min = Math.floor(seconds / 60)
  let time = ''
  if (min !== 0) {
    time += `${min}min${min === 1 ? ' ' : 's '}`
  }
  if (sec !== 0) {
    time += `${sec}s`
  }
  console.log(`Redis client reconnecting after ${time}`)
  retryAttempts++
  logger.info(`Redis Client trying to reconnect to Redis Server. Reconnection attempt: ${retryAttempts}.`)
})

export async function processMessage(message: {content: {operation: string, data: {key: string, value: string}}, ack: () => void, nack: () => void}) {
  try {
    const { operation, data } = message.content;
    
    if (operation === 'update' && redis.status === 'ready') {
      await redis.set(data.key, data.value);
      console.log('Data updated on Redis successfully');
      logger.info('Data updated on Redis successfully');
      // Acknowledge message
      message.ack();
    }
    else {
      console.error('Failed to process message');
      // Optionally requeue the message for later processing
      message.nack();
    }
  } catch (error) {
    console.error('Failed to process message', error);
    // Optionally requeue the message for later processing
    message.nack();
  }
}

export default redis