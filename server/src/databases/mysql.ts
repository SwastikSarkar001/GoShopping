import mysql, { ProcedureCallPacket, ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from 'constants/env';
import ApiError from 'utils/ApiError';
import { CONFLICT, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'constants/http';

// Create a connection pool to be used throughout the app
export const pool = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// A wrapper function for executing queries
const sqlQuery = async (sql: string, values: any[] = []) => {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute(sql, values)
    return results as ProcedureCallPacket<[RowDataPacket[], ResultSetHeader]>
  }
  catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      let message: string[] = err.sqlMessage.split(' ')
      let finalmessage = message[2] + ' already exists as ' + message[message.length - 1].substring(1, message[message.length - 1].lastIndexOf("'")).split('.')[1]
      throw new ApiError(CONFLICT, finalmessage)
    }
    else if (err.code === 'ER_SIGNAL_EXCEPTION') {
      if (err.sqlMessage.includes('incorrect') || err.sqlMessage.includes('does not exist'))
      throw new ApiError(UNAUTHORIZED, err.sqlMessage)
      else throw new ApiError(INTERNAL_SERVER_ERROR, err.sqlMessage, [err])
    }
    else throw new ApiError(INTERNAL_SERVER_ERROR, err.sqlMessage, [err])
  }
  finally {
    connection.release()
  }
}

export default sqlQuery;