import express from 'express'
import cors from 'cors'
// import bodyParser from 'body-parser'
import apiRoutes from 'routes/api.route'
import cookieParser from 'cookie-parser'
import { APP_URL, PORT } from 'constants/env'
import registered from 'middlewares/registered'
import errorHandler from 'middlewares/errorHandler'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: APP_URL,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// app.use(registered)

app.get('/', (req, res) => {
  res.send('App is running successfully!')
})

app.use('/api', apiRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`)
})