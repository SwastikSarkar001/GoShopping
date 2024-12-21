import express from 'express'
import cors from 'cors'
// import bodyParser from 'body-parser'
import apiRoutes from 'routes/api.route'
import cookieParser from 'cookie-parser'
import { APP_URL, PORT } from 'constants/env'
import errorHandler from 'middlewares/errorHandler'
import ApiError from 'utils/ApiError'

const app = express()
app.use(cors({
  origin: APP_URL,
  credentials: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
  throw new ApiError(500, "Hiii")  // Uncomment to throw a sample error
  res.send('App is running successfully!')
})

// app.use('/api', apiRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}/`)
})