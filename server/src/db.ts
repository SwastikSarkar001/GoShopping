import mysql from 'mysql2/promise'
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from 'constants/env';

// Create a connection pool to be used throughout the app
const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
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