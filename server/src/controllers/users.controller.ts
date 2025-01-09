import query from '../databases/db'
import { User } from '../types'
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from 'constants/http'
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from 'constants/env'
import bcrypt from 'bcryptjs'
import ApiResponse from 'utils/ApiResponse'
import ApiError from 'utils/ApiError'
import asyncHandler from 'utils/asyncHandler'
import jwt from 'jsonwebtoken'

export const addUser = asyncHandler (
  async (req, res, next) => {
    try {
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
      
      res.status(CREATED).json(
        new ApiResponse(CREATED, [results], 'User added successfully')
      )
    }
    catch (err) {
      next(err)
    }
  }
)

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
  // const resultsinfo = initialResult
  // try {
  //   const results = await query(`select username, firstname, middlename, lastname, email, phone, city, state, country from users`)
  //   resultsinfo.message = 'Users fetched successfully'
  //   resultsinfo.status = OK
  //   resultsinfo.result = results
  // }
  // catch (err) {
  //   console.error(err)
  //   resultsinfo.message = 'No users found'
  //   resultsinfo.status = NOT_FOUND
  // }
  // finally {
  //   return resultsinfo
  // }
}

type signinType = {
  username: string,
  password: string
}

export async function signIn(userdata: signinType) {
  // const resultsinfo = initialResult
  // try {

  //   const result = await query(`select * from users where username = ? and password = ?`, [userdata.username, userdata.password])
  //   // If successful then implement sessions using JWT
  //   if (result === undefined) throw new Error()
  //   resultsinfo.message = 'Users fetched successfully'
  //   resultsinfo.status = OK
  //   resultsinfo.result = result
  // }
  // catch (err) {
  //   console.error(err)
  //   resultsinfo.message = 'No users found'
  //   resultsinfo.status = NOT_FOUND
  // }
  // finally {
  //   return resultsinfo
  // }
}

const generateAccessToken = (user: User) => {
  return jwt.sign(
    user,
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY
    }
  )
}

const generateRefreshToken = (user: User) => {
  return jwt.sign(
    user,
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY
    }
  )
}