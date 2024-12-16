import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { addUser, getUsers } from './mysql.js'
import { User } from './types.js'
dotenv.config({path: '.env.local'})


const app = express()
app.use(cors())
app.use(express.json())

// app.post('/api/add_user', (req, res) => {
//   addUser(req as User)
// })

app.get('/api/users', async (req, res) => {
  const response = await getUsers()
  res.status(response.status)
  res.send(response.result)
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`)
})