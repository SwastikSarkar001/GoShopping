import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from 'constants/env';
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

const pingResult = await redis.ping();
console.log('Redis Ping Result: ', pingResult);

let retryAttempts = 0

redis.on('connect', () => {
  console.log('Redis client connected')
})
redis.on('ready', () => {
  console.log('Redis client is ready to accept commands')
  if (retryAttempts > 0) {
    console.log('Number of reconnection attempts:', retryAttempts)
    retryAttempts = 0
  }
})
redis.on('error', (err) => {
  console.error('Redis client error:', err)
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
  
})

export default redis