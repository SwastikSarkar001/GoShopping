import sqlQuery from '../databases/mysql'
import { UserWithUserid } from '../types'
import { BAD_REQUEST, CREATED, NO_CONTENT, OK, UNAUTHORIZED } from 'constants/http'
import ApiResponse from 'utils/ApiResponse'
import ApiError from 'utils/ApiError'
import asyncHandler from 'utils/asyncHandler'
import redis, { escapeSearchSymbols } from 'databases/redis'
import logger from 'utils/logger'
import { AccessTokenPayload, generateAccessToken, generateRefreshToken, RefreshTokenPayload, verifyToken } from 'utils/jwt'
import { accessTokenOptions, refreshTokenOptions } from 'utils/cookies'
import UserSchema from 'models/user.model'
import SessionSchema from 'models/session.model'
import { ZodError } from 'zod'

/**
 * Checks if a user exists in the database based on the provided field and value.
 * 
 * This function first checks the Redis database for the user. If the user is not found in Redis,
 * it then checks the MySQL database. If the user is found in MySQL, the user data is cached in Redis.
 * 
 * @param field - The field to check against, either 'email' or 'phone'.
 * @param value - The value of the field to check.
 * @returns A promise that resolves to a boolean indicating whether the user exists.
 * 
 * @throws Will throw an error if multiple users exist with the same email or phone number in Redis.
 * 
 * @remarks
 * **This function must be used inside the callback function of `asyncHandler()` function for smooth error handling,**
 * **or else the server may crash due to unhandled exceptions.**
 */
export const isUserExists = async (field: 'email' | 'phone', value: string): Promise<boolean> => {

  /* If Redis is ready then check from Redis database */
  if (redis.status !== 'ready') {
    const data = await redis.call('FT.SEARCH', 'users-idx', `@${field}:${escapeSearchSymbols(value)}`) as any[]

    /* If user exists then return true */
    if (data[0] == 1) {  // Question: Should I reset the expiry time of the key?
      return true
    }

    /* If user does not exist then check from MySQL database */
    else if (data[0] == 0) {
      const sqlData = await sqlQuery(`CALL getAllUserDetails(?, ?)`, [field, value])

      /* If there exist a data then return the data, cache it and return true */
      if (sqlData instanceof Array) {
        const [result] = sqlData[0] as UserWithUserid[]
        const {userid, ...rest} = result
        await redis
          .pipeline()
          .call('JSON.SET', `users:${userid}`, '$', JSON.stringify(rest))
          .expire(`users:${userid}`, 7*24*3600)
          .exec()
        return true
      }

      /* If no data exists then return false */
      else {
        return false
      }
    }

    /* If multiple users exist then throw an error indicating multiple users exist */
    else {
      logger.error('Multiple users exist with the same email or phone number in Redis database')
      return true
    }
  }

  /* If Redis is not ready then check from MySQL database */
  else {
    const sqlData = await sqlQuery(`CALL getAllUserDetails(?, ?)`, [field, value])

    /* If there exist a data then return the data and return true */
    if (sqlData instanceof Array) {
      return true
    }

    /* If no data exists then return false */
    else {
      return false
    }
  }
}

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
        if (!(await isUserExists('email', userdata.email))) {
          throw new ApiError(BAD_REQUEST, 'The provided email is already in use. Please use a different email address.')
        }
        if (!(await isUserExists('phone', userdata.phone))) {
          throw new ApiError(BAD_REQUEST, 'The provided phone number is already in use. Please use a different phone number.')
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

export const signIn = asyncHandler (
  async (req, res, next) => {
    try {
      res.status(NO_CONTENT)
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

