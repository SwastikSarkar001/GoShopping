import express from 'express'
import cors from 'cors'
import apiRoutes from 'routes/api.route'
import cookieParser from 'cookie-parser'
import { API_VERSION, APP_URL, PORT } from 'constants/env'
import errorHandler from 'middlewares/errorHandler'
import ApiError from 'utils/ApiError'
import redis from 'databases/redis'
import query from 'databases/mysql'
import logHandler from 'middlewares/logHandler'
import logger from 'utils/logger'
import { publishUpdate } from 'databases/rabbitmq'

const app = express()
app.use(cors({
  origin: APP_URL,
  credentials: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(logHandler)

// await redisClient.connect()


app.get('/', (req, res) => {
  throw new ApiError(500, "Hiii")  // Uncomment to throw a sample error
  res.send('App is running successfully!')
})

app.use(`/api/${API_VERSION}`, apiRoutes)

app.route('/test')
.get(async (req, res) => {
  if (redis.status === 'ready') {
    const d = await redis.get('test')
    res.status(200).send(d)
  }
  else {
    res.status(500).send('Redis is not ready')
  }
})
.post(async (req, res) => {
  // if (redis.status === 'ready') {
  //   const d = await redis.set('test', 'Hello, Redis!')
  //   res.status(200).send(d)
  // }
  // else {
  //   res.status(500).send('Redis is not ready')
  // }
  const d = await publishUpdate('update', {key: 'test', value: 'Hello, Redis!'})
  if (d) {
    res.status(200).send('OK')
  }
  else {
    res.status(500).send('Redis is not ready')
  }
})
.delete(async (req, res) => {
  if (redis.status === 'ready') {
    await redis.del('test')
    res.sendStatus(204)
  }
  else {
    res.status(500).send('Redis is not ready')
  }
})

// app.route('/test')
// .get(async (req, res) => {
//   if (redis.status === 'ready') {
//     let cursor = '0'
//     let values = []
//     do {
//       const [newCursor, keys] = await redis.scan(cursor, 'MATCH', 'users:*');
//       cursor = newCursor;
//       for (const key of keys) {
//         const value: string = await redis.call('json.get', key) as string;
//         if (value) {
//           values.push(JSON.parse(value));
//         }
//       }
//     } while (cursor !== '0');

//     if (values.length !== 0) {
//       console.log('Cache Hit!')
//       logger.info('Data found from cache.')
//       const response = values
//       res.status(200).json(response)
//     }
//     else {
//       console.log('Cache Miss!')
//       logger.info('Data not found from cache')
//       const response = await query('SELECT * FROM users') as any[]
//       response.map(async (val) => {
//         const { userid, ...rest} = val
//         await redis.call('json.set', `users:${val.userid}`, '$', JSON.stringify(rest))
//       })
//       res.status(200).json(response)
//     }
//   }
//   else {
//     console.log('Redis Server is not connected! Calling database...')
//     logger.warn('Redis Server is not connected or seems offline.')
//     const response = await query('SELECT * FROM users') as any[]
//     res.status(200).json(response)
//   }
// })
// .post(async (req, res) => {
//   if (redis.status === 'ready') {
//     const d = await redis.set('test', 'Hello, Redis!')
//     res.status(200).send(d)
//   }
//   else {
//     res.status(500).send('Redis is not ready')
//   }
// })
// .delete(async (req, res) => {
//   if (redis.status === 'ready') {
//     const d = await redis.del('test')
//     res.sendStatus(204)
//   }
//   else {
//     res.status(500).send('Redis is not ready')
//   }
// })



app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}/`)
  logger.info(`Server is listening at http://localhost:${PORT}/`)
})

const shutdown = () => {
  console.log('Server has been closed.')
  logger.info('Server has been closed.')
  server.close((err) => {
    logger.info(`Server has unexpectedly closed. Message: ${err?.message}`)
    console.log(err?.stack)
    process.exit(1);
  })
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown)

// // Handle server shutdown and close Redis connection
// function gracefulShutdown() {
//   redisClient.quit()
//     .then(() => console.log('Redis client disconnected'))
//     .catch(err => console.error('Redis client error:', err))
//   console.log('Shutting down server...')
//   server.close((err) => {
//     console.error('Server close error:', err)
//     process.exit(1)
//   })
//   console.log('Server is shut down')
//   process.exit(0)
// };

// // Catch termination signals
// process.on('SIGINT', gracefulShutdown); // Handle Ctrl+C
// process.on('SIGTERM', gracefulShutdown); // Handle termination signals