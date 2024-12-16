/// <reference path="./types.d.ts" />

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { User } from './types.js'
dotenv.config({path: '.env.local'})

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
  const success = false
  const connection = await createConnection()
  connection.connect()
  .then(() => {
    const columns = Object.keys(userdata).join(', ')
    const values = Object.values(userdata).join(', ')
    connection.query(`insert into table users(${columns}) values(${values})`)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.error(err)
    })
  })
  .catch((err) => console.error(err))
  .finally(() => connection.destroy())
}

export async function getUsers() {
  const connection = await createConnection()
  const resultsinfo: resultsInfoType = {status: 100}
  try {
    const [results] = await connection.query(`select username, firstname, middlename, lastname, email, phone, city, state, country from users`)
    connection.destroy()
    resultsinfo.status = 200
    resultsinfo.result = results
  }
  catch (err) {
    console.error(err)
    connection.destroy()
    resultsinfo.status = 404
  }
  return resultsinfo
}