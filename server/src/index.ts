import express from 'express'
import cors from 'cors'
import apiRoutes from 'routes/api.route'
import cookieParser from 'cookie-parser'
import { API_VERSION, APP_URL, PORT } from 'constants/env'
import errorHandler from 'middlewares/errorHandler'
import ApiError from 'utils/ApiError'
import redis from 'databases/redis'
import query from 'databases/db'

const app = express()
app.use(cors({
  origin: APP_URL,
  credentials: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// await redisClient.connect()


app.get('/', (req, res) => {
  throw new ApiError(500, "Hiii")  // Uncomment to throw a sample error
  res.send('App is running successfully!')
})

app.use(`/api/${API_VERSION}`, apiRoutes)

// app.route('/test')
// .get(async (req, res) => {
//   if (redis.status === 'ready') {
//     const d = await redis.get('test')
//     res.status(200).send(d)
//   }
//   else {
//     res.status(500).send('Redis is not ready')
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

app.route('/test')
.get(async (req, res) => {
  if (redis.status === 'ready') {
    const d = await redis.call('json.get', 'test')
    if (d) {
      const response = JSON.parse(d as string)
      res.status(200).json(response)
    }
    else {
      const response = await query('SELECT * FROM users where userid = ?', [1]) as any[]
      await redis.call('json.set', 'test', '$', JSON.stringify(response[0]))
      res.status(200).json(response[0])
    }
  }
})
.post(async (req, res) => {
  if (redis.status === 'ready') {
    const d = await redis.set('test', 'Hello, Redis!')
    res.status(200).send(d)
  }
  else {
    res.status(500).send('Redis is not ready')
  }
})
.delete(async (req, res) => {
  if (redis.status === 'ready') {
    const d = await redis.del('test')
    res.sendStatus(204)
  }
  else {
    res.status(500).send('Redis is not ready')
  }
})



app.use(errorHandler)

const server = app.listen(PORT, async () => {
  console.log(`Server is listening at http://localhost:${PORT}/`)
})

const shutdown = () => {
  server.close(() => {
    console.log('Server shutting down');
    process.exit(0);
  });
};

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