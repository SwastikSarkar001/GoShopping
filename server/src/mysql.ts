import mysql from 'mysql2/promise'
import query from './db'
import { User } from './types'
import { CONTINUE, CREATED, NOT_FOUND, OK } from 'constants/http'


type resultsInfoType = {
  message: string,
  status: number,
  result?: mysql.QueryResult
}

const initialResult: resultsInfoType = {message: '', status: CONTINUE}

export async function addUser(userdata: User) {
  const resultsinfo = initialResult
  try {
    const columns = Object.keys(userdata).join(', ')
    // const values = Object.values(userdata).map(data => `'${data}'`).join(', ')
    const values = Object.values(userdata).join(', ')
    const [results] = await query(`insert into users(${columns}) values(${values})`)
    resultsinfo.message = 'User added successfully'
    resultsinfo.status = CREATED
    resultsinfo.result = results
  }
  catch (err) {
    console.error(err)
    resultsinfo.message = 'User not added'
    resultsinfo.status = NOT_FOUND
  }
  finally {
    return resultsinfo
  }
}

export async function getUsers() {
  const resultsinfo = initialResult
  try {
    const [results] = await query(`select username, firstname, middlename, lastname, email, phone, city, state, country from users`)
    resultsinfo.message = 'Users fetched successfully'
    resultsinfo.status = OK
    resultsinfo.result = results
  }
  catch (err) {
    console.error(err)
    resultsinfo.message = 'No users found'
    resultsinfo.status = NOT_FOUND
  }
  finally {
    return resultsinfo
  }
}