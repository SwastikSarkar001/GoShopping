import redis from 'redis'

const redisClient = redis.createClient()

redisClient.on('connect', () => {
  redisClient.ping().then((res) => console.log('Redis ping:', res))
})
redisClient.on('ready', () => {
  console.log('Redis client is ready to accept commands')
})
redisClient.on('error', (err) => {
  console.error('Redis client error:', err)
})
redisClient.on('end', () => {
  console.log('Redis client disconnected')
})
redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting...')
})

export default redisClient