/// <reference path="./types.d.ts" />

import mysql from 'mysql2/promise'
import query from './db.js'
import { User } from './types.js'


type resultsInfoType = {
  status: number,
  result?: mysql.QueryResult
}

async function createConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
}

export async function addUser(userdata: User) {
  const resultsinfo: resultsInfoType = {status: 100}
  try {
    const columns = Object.keys(userdata).join(', ')
    // const values = Object.values(userdata).map(data => `'${data}'`).join(', ')
    const values = Object.values(userdata).join(', ')
    const [results] = await query(`insert into users(${columns}) values(${values})`)
    resultsinfo.status = 200
    resultsinfo.result = results
  }
  catch (err) {
    console.error(err)
    resultsinfo.status = 404
  }
  finally {
    return resultsinfo
  }
}

export async function getUsers() {
  const resultsinfo: resultsInfoType = {status: 100}
  try {
    const [results] = await query(`select username, firstname, middlename, lastname, email, phone, city, state, country from users`)
    resultsinfo.status = 200
    resultsinfo.result = results
  }
  catch (err) {
    console.error(err)
    resultsinfo.status = 404
  }
  finally {
    return resultsinfo
  }
}