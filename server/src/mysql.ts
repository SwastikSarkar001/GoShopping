import mysql from 'mysql2/promise'
import query from './db'
import { User } from './types'
import { BAD_REQUEST, CONTINUE, CREATED, NOT_FOUND, OK } from 'constants/http'
import bcrypt from 'bcryptjs'
import ApiResponse from 'utils/ApiResponse'
import ApiError from 'utils/ApiError'
import asyncHandler from 'utils/asyncHandler'
import { RequestHandler } from 'express'

type resultsInfoType = {
  message: string,
  status: number,
  result?: mysql.QueryResult
}

const initialResult: resultsInfoType = {message: '', status: CONTINUE}

export const addUser = asyncHandler(async (req, res, next) => {
  const userdata = req.body as User
  userdata.middlename === undefined && (userdata.middlename = '')
  const password = userdata.password
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  userdata.password = hashedPassword
  // userdata.salt = salt
  const keys = Object.keys(userdata)
  const values = Object.values(userdata)
  const results = await query(`insert into users (${keys}) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values)
  
  if (!results) {
    throw new ApiError(BAD_REQUEST, 'User not added');  // Throw custom error
  }
  
  return new ApiResponse(OK, results, 'User added successfully')
})

//   (userdata: User) {
//   const resultsinfo = initialResult
//   try {
//     userdata.middlename === undefined && (userdata.middlename = '')
//     const password = userdata.password
//     const salt = await bcrypt.genSalt()
//     const hashedPassword = await bcrypt.hash(password, salt)
//     userdata.password = hashedPassword
//     // userdata.salt = salt
//     const keys = Object.keys(userdata)
//     const values = Object.values(userdata)
//     const results = await query(`insert into users (${keys}) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values)
//     resultsinfo.message = 'User added successfully'
//     resultsinfo.status = CREATED
//     resultsinfo.result = results
//   }
//   catch (err) {
//     console.error(err)
//     resultsinfo.message = 'User not added!\n'
//     resultsinfo.status = BAD_REQUEST
//   }
//   finally {
//     return resultsinfo
//   }
// }

export async function getUsers() {
  const resultsinfo = initialResult
  try {
    const results = await query(`select username, firstname, middlename, lastname, email, phone, city, state, country from users`)
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

type signinType = {
  username: string,
  password: string
}

export async function signIn(userdata: signinType) {
  const resultsinfo = initialResult
  try {

    const [result] = await query(`select * from users where username = ? and password = ?`, [userdata.username, userdata.password])
    // If successful then implement sessions using JWT
    if (result === undefined) throw new Error()
    resultsinfo.message = 'Users fetched successfully'
    resultsinfo.status = OK
    resultsinfo.result = result
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