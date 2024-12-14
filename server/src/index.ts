import mysql from 'mysql2/promise'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})
const app = express()

app.use(cors())

app.get('/users', (req, res) => {
  res.send('Hello World')
})

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`)
})