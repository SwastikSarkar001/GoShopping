import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { hash, genSalt } from 'bcryptjs'
import { addUser, getUsers } from './mysql'
import { User } from './types'
import { PORT } from 'constants/env'

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.post('/api/add_user', (req, res) => {
  addUser(req.body as User)
})

app.get('/api/users', async (req, res) => {
  const response = await getUsers()
  res.status(response.status)
  res.send(response.result)
})

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`)
})