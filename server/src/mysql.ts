import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'eazzybizz',
})

connection.connect()
.then(() => {
  console.log('Connected successfully to MySQL database')
  

})
.catch((err) => console.error(err))