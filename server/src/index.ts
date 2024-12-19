import express from 'express'
import cors from 'cors'
// import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { addUser, getUsers } from './mysql'
import { User } from './types'
import { APP_URL, PORT } from 'constants/env'

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: APP_URL,
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.post('/api/add_user', async (req, res) => {
  const response = await addUser(req.body as User)
  res.status(response.status)
  res.send(response.message)  
})

app.get('/api/users', async (req, res) => {
  const response = await getUsers()
  res.status(response.status)
  res.send(response.result)
})

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`)
})