import sqlQuery from '../databases/mysql'
import { UserWithUserid } from '../types'
import { BAD_REQUEST, CONFLICT, CREATED, NO_CONTENT, OK, UNAUTHORIZED } from 'constants/http'
import ApiResponse from 'utils/ApiResponse'
import ApiError from 'utils/ApiError'
import asyncHandler from 'utils/asyncHandler'
import redis from 'databases/redis'
import logger from 'utils/logger'
import { AccessTokenPayload, generateAccessToken, generateRefreshToken, RefreshTokenPayload } from 'utils/jwt'
import { accessTokenOptions, refreshTokenOptions } from 'utils/cookies'
import UserSchema from 'models/user.model'
import SessionSchema from 'models/session.model'
import { ZodError } from 'zod'
import { isUserExists } from './utils.controller'


export const addUser = asyncHandler (
  async (req, res, next) => {
    try {
      type returnType = {
        '@uid': string
        '@sid': string
        '@exp': string
      }

      /* Get the user data from the request body and validate */
      try {
        const userdata = UserSchema.pick({
            firstname: true,
            middlename: true,
            lastname: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            country: true,
            password: true
          }
        ).parse(req.body)
        
        // const userdata = req.body as BaseUser
        const userAgent = req.headers['user-agent'] as string

        /* Check if user already exists */
        if (await isUserExists('email', userdata.email)) {
          throw new ApiError(CONFLICT, 'The provided email is already in use. Please use a different email address.')
        }
        if (await isUserExists('phone', userdata.phone)) {
          throw new ApiError(CONFLICT, 'The provided phone number is already in use. Please use a different phone number.')
        }

        /* Prepare the values to insert into the database */
        const values = [...Object.values(userdata), userAgent]

        /* Insert user data into database and get the result */
        const results = await sqlQuery(`CALL addUser(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, values)
        /* If user added successfully then return the user data */
        if (results instanceof Array) {
          const [result] = results[0] as returnType[]
          if (result === undefined) throw new ApiError(BAD_REQUEST, 'User not added')
          
          /* Prepare the user data */
          const {password, ...restUser} = userdata
          const userid = result['@uid']

          /* Prepare the session data */
          const sessionid = result['@sid']
          const restSession = SessionSchema.pick({
            userid: true,
            useragent: true,
            expires: true
          })
          .parse({
            userid: userid,
            useragent: userAgent,
            expires: result['@exp']
          })

          /* Cache the user and session data in Redis */
          redis.status === 'ready' &&
          await redis
            .pipeline()
            .call('JSON.SET', `users:${userid}`, '$', JSON.stringify(restUser))
            .expire(`users:${userid}`, 7*24*3600)
            .call('JSON.SET', `sessions:${sessionid}`, '$', JSON.stringify(restSession))
            .expire(`sessions:${sessionid}`, 7*24*3600)
            .exec()

          /* Generate the access and refresh tokens */
          const accessToken = generateAccessToken({ userid: userid, sessionid: sessionid })
          const refreshToken = generateRefreshToken({ sessionid: sessionid })

          /* Send the response with the tokens */
          res
            .status(CREATED)
            .cookie('access_token', accessToken, accessTokenOptions)
            .cookie('refresh_token', refreshToken, refreshTokenOptions)
            .json(
              new ApiResponse(
                CREATED,
                [
                  {
                    clientData: restUser,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                  }
                ],
                'User added successfully'
              )
            )
        }
        /* If user not added then throw an error */
        else {
          throw new ApiError(BAD_REQUEST, 'User not added')
        }
      }

      /* If user data is invalid then throw an error */
      catch (error) {
        if (error instanceof ZodError) {
          logger.error('Invalid user data sent from client')
          throw new ApiError(BAD_REQUEST, 'Invalid user data', error.errors)
        }
        else if (error instanceof ApiError) {
          throw error
        }
        else {
          throw error
        }
      }
    }
    catch (err) {
      next(err)
    }
  }
)

export const deleteUser = asyncHandler (
  async (req, res, next) => {
    try {
      res.status(NO_CONTENT)
    }
    catch (err) {
      next(err)
    }
  }
)

export const verifyUser = asyncHandler (
  async (req, res, next) => {
    try {
      // Get the access token from the request header
      // Verify the access token
      // If verified then send a success response
      // If not verified then send unauthorized response
    }
    catch (err) {
      next(err)
    }
  }
)

export const verifyAndGenerateAccessToken = asyncHandler (
  async (req, res, next) => {
    try {
      // If verified then generate access token and send it back
      const data: RefreshTokenPayload = req.body.verifiedData

      // Check if the session exists in Redis
      if (redis.status === 'ready') {
        const [userid] = JSON.parse(await redis.call('JSON.GET', `sessions:${data.sessionid}`, '$.userid') as string)
        
        // Redis found the session in the database
        if (userid) {
          const accessPayload: AccessTokenPayload = {
            userid: userid,
            sessionid: data.sessionid
          }
          const accessToken = generateAccessToken(accessPayload)
          res
            .cookie('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' })
            .status(OK)
            .json(
              new ApiResponse(OK, [accessToken], 'Access token generated successfully')
            )
        }
        
        // Redis did not find the session in the database
        else {
          const userdata = await sqlQuery(`CALL getUserFromSessionId(?)`, [data.sessionid])
          
          // MySQL found the session in the database
          if (userdata instanceof Array) {
            const [result] = userdata[0] as any[]
            const accessPayload: AccessTokenPayload = {
              userid: result.userid,
              sessionid: data.sessionid
            }
            const accessToken = generateAccessToken(accessPayload)
            res
              .cookie('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' })
              .status(OK)
              .json(
                new ApiResponse(OK, [accessToken], 'Access token generated successfully')
              )
          }
          
          // MySQL did not find the session in the database
          else {
            throw new ApiError(UNAUTHORIZED, 'Session not found')
          }
        }
      }
      // Redis is not ready
      else {
        logger.warn('Redis Server is not connected or seems offline.')
        const session = await sqlQuery(`CALL getSession(?)`, [data.sessionid])
        // MySQL found the session in the database
        if (session instanceof Array) {

          // const accessToken = generateAccessToken()
          // res.status(OK).json(
          //   new ApiResponse(OK, [accessToken], 'Access token generated successfully')
          // )
        }
        // MySQL did not find the session in the database
        else {
          throw new ApiError(UNAUTHORIZED, 'Session not found')
        }
      }   
    }
    catch (err) {
      next(err)
    }
  }
)

/**
 * Handles user sign-in by validating the provided email and password, creating a session, and generating access and refresh tokens.
 * 
 * This function performs the following steps:
 * 1. Validates the user data from the request body using the `UserSchema`.
 * 2. Checks if the user exists in the database by calling the `signIn` stored procedure.
 * 3. If the user exists, creates a session for the user by calling the `createSession` stored procedure.
 * 4. Caches the user and session data in Redis if Redis is ready.
 * 5. Generates access and refresh tokens for the user.
 * 6. Sends the response with the tokens and user data.
 * 
 * @param req - The request object containing the user data in the body.
 * @param res - The response object used to send the response.
 * @param next - The next middleware function in the stack.
 * 
 * @throws {ApiError} If the user data is invalid, the user does not exist, or there is a problem creating the session.
 */
export const signIn = asyncHandler (
  async (req, res, next) => {
    try {
      // Get the user data from the request body and validate
      const userdata = UserSchema.pick({
          email: true,
          password: true
        }
      ).parse(req.body)

      // Check if the user exists in the database
      const results = await sqlQuery(`CALL signIn(?, ?)`, [userdata.email, userdata.password])
      if (results instanceof Array) {
        const [result] = results[0] as UserWithUserid[]
        const user = UserSchema.pick({
            userid: true,
            firstname: true,
            middlename: true,
            lastname: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            country: true
          }
        ).parse(result)
        const {userid, ...rest} = user
        const userAgent = req.headers['user-agent'] as string
        const sessionResults = await sqlQuery(`CALL createSession(?, ?)`, [userid, userAgent])
        if (sessionResults instanceof Array) {
          const [sessionResult] = sessionResults[0] as any[]
          if (sessionResult === undefined) throw new ApiError(UNAUTHORIZED, 'Problem creating session')
          const sessionid = sessionResult['@sid']
          const restSession = SessionSchema.pick({
            userid: true,
            useragent: true,
            expires: true
          })
          .parse({
            userid: userid,
            useragent: userAgent,
            expires: sessionResult['@exp']
          })
          redis.status === 'ready' &&
          await redis
            .pipeline()
            .call('JSON.SET', `users:${userid}`, '$', JSON.stringify(rest))
            .expire(`users:${userid}`, 7*24*3600)
            .call('JSON.SET', `sessions:${sessionid}`, '$', JSON.stringify(restSession))
            .expire(`sessions:${sessionid}`, 7*24*3600)
            .exec()
          const accessToken = generateAccessToken({ userid: userid.toString(), sessionid: sessionid })
          const refreshToken = generateRefreshToken({ sessionid: sessionid })
          res
            .status(OK)
            .cookie('access_token', accessToken, accessTokenOptions)
            .cookie('refresh_token', refreshToken, refreshTokenOptions)
            .json(
              new ApiResponse(
                OK,
                [
                  {
                    clientData: rest,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                  }
                ],
                'User signed in successfully'
              )
            )
        }
        else {
          throw new ApiError(UNAUTHORIZED, 'Problem creating session')
        }
      }
      else {
        throw new ApiError(UNAUTHORIZED, 'Invalid email or password')
      }
    }
    catch (err) {
      next(err)
    }
  }
)

export const signOut = asyncHandler (
  async (req, res, next) => {
    try {
      // Get the session id from the request body and validate
      const data = req.body

      // Check if the session exists in the database
      const results = await sqlQuery(`CALL signOut(?)`, [data.sessionid])
      if (results instanceof Array) {
        const [result] = results[0] as any[]
        if (result === undefined) throw new ApiError(UNAUTHORIZED, 'Session not found')
        redis.status === 'ready' &&
        await redis.del(`sessions:${data.sessionid}`)
        res.status(NO_CONTENT).send()
      }
      else {
        throw new ApiError(UNAUTHORIZED, 'Session not found')
      }
    }
    catch (err) {
      next(err)
    }
  }
)

// export async function getUsers() {
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
// }

// type signinType = {
//   username: string,
//   password: string
// }

// export async function signIn(userdata: signinType) {
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
// }

