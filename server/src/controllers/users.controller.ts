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
import { ResultSetHeader } from 'mysql2'
import { sendEmail } from 'utils/Nodemailer'
import { welcomeToEazzyBizzTemplate } from 'utils/Mails'


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

          /* Send a welcome email message to the registered email */
          setImmediate(async () => {
            try {
              await sendEmail({
                to: userdata.email,
                subject: welcomeToEazzyBizzTemplate.subject,
                html: (welcomeToEazzyBizzTemplate.body as string)
                .replace("[User's Name]", userdata.firstname + (userdata.middlename ? ' ' + userdata.middlename : '') + ' ' + userdata.lastname)
              })
            }
            catch (err) {
              logger.error('Error sending email', err)
            }
          })

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
          const [firstIssue] = error.errors
          logger.error('Invalid user data sent from client')
          if (firstIssue) {
            const { path, message } = firstIssue
            const paths = path.join('.')
            const issueMsg = paths ? `${paths}: ${message}` : message
            logger.error(JSON.stringify(error.errors))
            throw new ApiError(BAD_REQUEST, `Invalid user data. ${issueMsg}`, error.errors)
          }
          else {
            throw new ApiError(BAD_REQUEST, 'Invalid user data', error.errors)
          }
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
            .cookie('access_token', accessToken, accessTokenOptions)
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
              .cookie('access_token', accessToken, accessTokenOptions)
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
      const userdata = {
        email: req.body.email,
        password: req.body.password
      }

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
      const data = req.body.verifiedData

      // Check if the session exists in the database
      const results = await sqlQuery(`CALL signOut(?)`, [data.sessionid]) as ResultSetHeader
      if (results  === undefined) throw new ApiError(UNAUTHORIZED, 'Session not found')
      redis.status === 'ready' &&
      await redis.del(`sessions:${data.sessionid}`)
      res
        .status(NO_CONTENT)
        .clearCookie('access_token')
        .clearCookie('refresh_token')
        .send()
    }
    catch (err) {
      next(err)
    }
  }
)

export const getUserData = asyncHandler (
  async (req, res, next) => {
    try {
      // Get the user data from the request body and validate
      const data = req.body.verifiedData as AccessTokenPayload

      let userdata, sessiondata

      /* Redis is ready to respond */
      if (redis.status === 'ready') {
        userdata = JSON.parse(await redis.call('JSON.GET', `users:${data.userid}`) as string)
        sessiondata = JSON.parse(await redis.call('JSON.GET', `sessions:${data.sessionid}`) as string)
        if (userdata && sessiondata) {
          await redis
            .pipeline()
            .expire(`users:${data.userid}`, 7*24*3600)
            .expire(`sessions:${data.sessionid}`, 7*24*3600)
            .exec()

          const returnUserData = {
            firstname: userdata.firstname,
            middlename: userdata.middlename,
            lastname: userdata.lastname,
            email: userdata.email,
            phone: userdata.phone,
            city: userdata.city,
            state: userdata.state,
            country: userdata.country
          }
          res.status(OK).json(new ApiResponse(OK, [returnUserData], 'User data retrieved successfully'))
          return
        }
      }
      const sqlRes = await sqlQuery(`CALL getUserAndSessionData(?)`, [data.sessionid])
      if (sqlRes instanceof Array) {
        const [result] = sqlRes[0] as any[]
        if (result === undefined) throw new ApiError(UNAUTHORIZED, 'Session not found')
        const returnUserData = {
          firstname: result.firstname,
          middlename: result.middlename,
          lastname: result.lastname,
          email: result.email,
          phone: result.phone,
          city: result.city,
          state: result.state,
          country: result.country
        }
        const sessionData = {
          userid: data.userid,
          useragent: result.clientdata,
          expires: result.expires
        }
        try {
          await redis
            .pipeline()
            .call('JSON.SET', `users:${data.userid}`, '$', JSON.stringify(returnUserData))
            .expire(`users:${data.userid}`, 7*24*3600)
            .call('JSON.SET', `sessions:${data.sessionid}`, '$', JSON.stringify(sessionData))
            .expire(`sessions:${data.sessionid}`, 7*24*3600)
            .exec()
        }
        catch {
          logger.error('Problem caching user and session data in Redis')
        }
        res.status(OK).json(new ApiResponse(OK, [returnUserData], 'User data retrieved successfully'))
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