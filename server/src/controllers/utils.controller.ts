import { BAD_REQUEST, CONFLICT, UNAUTHORIZED, OK } from "constants/http"
import sqlQuery from "databases/mysql"
import redis, { escapeSearchSymbols } from "databases/redis"
import { UserWithUserid } from "types"
import ApiError from "utils/ApiError"
import ApiResponse from "utils/ApiResponse"
import asyncHandler from "utils/asyncHandler"
import logger from "utils/logger"
import { emailVerificationTemplate } from "utils/Mails"
import { sendEmail } from "utils/Nodemailer"
import crypto from "crypto"

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
export const isUserExists = async (field: 'email' | 'phone' | 'sitename', value: string): Promise<boolean> => {
  /* If Redis is ready or sitename is not to be checked then check from Redis database */
  if (redis.status === 'ready' && field !== 'sitename') {
    const data = await redis.call('FT.SEARCH', 'users-idx', `@${field}:${escapeSearchSymbols(value)}`) as any[]

    /* If user exists then return true */
    if (data[0] == 1) {
      await redis.expire(data[1], 7*24*3600)
      return true
    }

    /* If user does not exist then check from MySQL database */
    else if (data[0] == 0) {
      const sqlData = await sqlQuery(`CALL get_all_user_details(?, ?)`, [field, value])
      /* If there exist a data then return the data, cache it and return true */
      if (sqlData instanceof Array) {
        /* If no data is found return false */
        if (sqlData[0].length === 0) return false
        
        /* If data is found return true */
        else {
          const [result] = sqlData[0] as UserWithUserid[]
          const {userid, ...rest} = result
          await redis
            .pipeline()
            .call('JSON.SET', `users:${userid}`, '$', JSON.stringify(rest))
            .expire(`users:${userid}`, 7*24*3600)
            .exec()
          return true
        }
      }

      /* If no data exists then return false */
      else return false
    }

    /* If multiple users exist then throw an error indicating multiple users exist */
    else {
      logger.error('Multiple users exist with the same email or phone number in Redis database')
      return true
    }
  }

  /* If Redis is not ready then check from MySQL database */
  else {
    const sqlData = await sqlQuery(`CALL get_all_user_details(?, ?)`, [field, value])

    /* If there exist a data then return the data and return true */
    if (sqlData instanceof Array) {
      /* If no data is found return false */
      if (sqlData[0].length === 0) return false

      /* If data is found then return true */
      else return true
    }

    /* If no data exists then return false */
    else return false
  }
}

/**
 * 
 */
export const verifyFieldAndSendOtp = asyncHandler (
  async (req, res, next) => {
    try {
      /* Fetching all required data */
      const { field, value, fullname } = req.query

      /* Check if the request body is valid */
      if (!value || !fullname) throw new ApiError(BAD_REQUEST, 'Invalid request body')
      else if (field === 'email' || field === 'phone') {
        const userExists = await isUserExists(field, value as string)
        if (userExists) {
          throw new ApiError(CONFLICT, 'User already exists!')
        }
        else {
          const name: string = (fullname as string) || 'user'
          // const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
          const otp = (field === 'email') ? Math.floor(1000 + Math.random() * 9000) : 1234 // For testing purposes
          /* Store OTP in Redis Database */
          if (redis.status === 'ready') {
            await redis.set(`otps:${field}:${(value as string).replace(/\s+/g, '')}`, crypto.createHash('sha256').update(otp.toString()).digest('hex'), 'EX', 10*60)
          }

          /* Store OTP in MySQL Database */
          else {
            await sqlQuery(`CALL add_otp(?, ?, ?)`, [field, value, otp])
          }

          /* Making an event to send email to user */
          if (field === 'email') {
            setImmediate(async () => {
              try {
                await sendEmail({
                  to: value.toString().trim(),
                  subject: emailVerificationTemplate.subject,
                  html: (emailVerificationTemplate.body as string)
                  .replace("[User's Name]", name)
                  .replace("[OTP Number]", otp.toString())
                })
              }
              catch (err) {
                logger.error('Error sending email', err)
              }
            })
          }
          else {
            // Send SMS to user using setImmediate function (Needs implementation)
          }
          res.status(OK).json(new ApiResponse(OK, [], `Unique ${field === 'email' ? 'email' : 'phone number'}!`))
        }
      }
      else {
        throw new ApiError(BAD_REQUEST, 'Invalid request body')
      }
    }
    catch (err) {
      next(err)
    }
  }
)

export const verifyOtp = asyncHandler (
  async (req, res, next) => {
    try {
      const { field, value, otp } = req.query
      if (!value || !otp || !field) throw new ApiError(BAD_REQUEST, 'Invalid request body')
      if (redis.status === 'ready') {
        const data = await redis.get(`otps:${field}:${(value as string).replace(/\s+/g, '')}`)

        /* OTP doesn't exist */
        if (!data) throw new ApiError(UNAUTHORIZED, 'OTP not found in the database')
        
        /* OTP exists and hashes matched */
        else if (data === crypto.createHash('sha256').update(otp.toString()).digest('hex')) {
          await redis.del(`otps:${field}:${(value as string).replace(/\s+/g, '')}`)
          res.status(OK).json(new ApiResponse(OK, [], 'OTP verified successfully'))
        }

        /* OTP exists but hashes didn't match */
        else {
          throw new ApiError(UNAUTHORIZED, 'Incorrect or invalid OTP')
        }
      }

      /* If Redis is not ready then check from MySQL database */
      else {
        const responseData = await sqlQuery('CALL delete_otp(?, ?, ?)', [field, value, otp])
        if (responseData instanceof Array) {
          const [resData] = responseData[0] as any[]
          if (resData === undefined) throw new ApiError(UNAUTHORIZED, 'Incorrect or invalid OTP')
          const isVerified = Object.keys(resData)[0] as string
          if (parseInt(isVerified))
          res.status(OK).json(new ApiResponse(OK, [], 'OTP verified successfully'))
          else throw new ApiError(UNAUTHORIZED, 'Incorrect or invalid OTP')
        }
        else {
          throw new ApiError(UNAUTHORIZED, 'Incorrect or invalid OTP')
        }
      }
    }
    catch (err) {
      next(err)
    }
  }
)

export const verifySitename = asyncHandler (
  async (req, res, next) => {
    try {
      const { value } = req.query
      if (!value) throw new ApiError(BAD_REQUEST, 'Invalid request body')
      const userExists = await isUserExists('sitename', value as string)
      if (userExists) {
        throw new ApiError(CONFLICT, 'Sitename already exists!')
      }
      else {
        res.status(OK).json(new ApiResponse(OK, [], `Unique site name!`))
      }
    }
    catch (err) {
      next(err)
    }
  }
)