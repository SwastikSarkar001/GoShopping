import mysql from 'mysql2/promise'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.use(cors())

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test',
});



const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`)
})