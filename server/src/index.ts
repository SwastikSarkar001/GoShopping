import express from 'express'
import cors from 'cors'
import apiRoutes from 'routes/api.route'
import cookieParser from 'cookie-parser'
import { API_VERSION, APP_URL, PORT } from 'constants/env'
import errorHandler from 'middlewares/errorHandler'
import logHandler from 'middlewares/logHandler'
import logger from 'utils/logger'
import { OK } from 'constants/http'

const app = express()
app.use(cors({
  origin: APP_URL,
  credentials: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(logHandler)

app.get('/', (req, res) => {
  res.status(OK).send('Server is running and listening requests.')
})

app.use(`/api/${API_VERSION}`, apiRoutes)

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