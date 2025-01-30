import asyncHandler from "utils/asyncHandler"
import { pool } from "databases/mysql"
import redis from "databases/redis"
import { transporter } from "utils/Nodemailer"
import ApiResponse from "utils/ApiResponse"
import { OK } from "constants/http"

export const health = asyncHandler (
  async (req, res, next) => {
    try {
      const healthCheck: {[key: string]: 'Healthy' | 'Unhealthy' | null} = {
        Redis: null,
        MySQL: null,
        Nodemailer: null
      }
  
      /* Checking Redis Server */
      const redisCheck = new Promise<void>(resolve => {
        healthCheck.Redis = (redis.status === 'ready') ? 'Healthy' : 'Unhealthy'
        resolve()
      })
  
      /* Checking MySQL Server */
      const sqlCheck = new Promise<void>(async resolve => {
        const sqlConn = await pool.getConnection()
        try {
          await sqlConn.ping()
          healthCheck.MySQL = 'Healthy'
        }
        catch (err) {
          healthCheck.MySQL = 'Unhealthy'
        }
        finally {
          sqlConn.release()
          resolve()
        }
      })

      /* Checking Nodemailer Transporter */
      const nodemailerCheck = new Promise<void>(async resolve => {
        try {
          const v = await transporter.verify()
          if (v) {
            healthCheck.Nodemailer = 'Healthy'
          }
        }
        catch (err) {
          healthCheck.Nodemailer = 'Unhealthy'
        }
        finally {
          resolve()
        }
      })
      await Promise.all([redisCheck, sqlCheck, nodemailerCheck])
      res.status(OK).json(new ApiResponse(OK, [healthCheck], 'Health check completed successfully'))
    }
    catch (err) {
      next(err)
    }
  }
)