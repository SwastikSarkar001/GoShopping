import mysql from 'mysql2/promise'
import 'config.js'

// Create a connection pool to be used throughout the app
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// A wrapper function for executing queries
const query = async (sql: string, values: any[] = []): Promise<any> => {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  }
  catch (err) {
    throw err
  }
  finally {
    connection.release()
  }
}

export default query;