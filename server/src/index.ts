import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { addUser, getUsers } from './mysql.js'
import { User } from './types.js'
import 'config.js'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/add_user', (req, res) => {
  addUser(req.body as User)
})

app.get('/api/users', async (req, res) => {
  const response = await getUsers()
  res.status(response.status)
  res.send(response.result)
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`)
})