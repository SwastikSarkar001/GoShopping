import { HttpStatusCode } from "constants/http"

export default class ApiError extends Error {
  statusCode: HttpStatusCode
  data: any | null
  errors: any[]
  success: boolean
  
  constructor (
    statusCode: HttpStatusCode,
    message = 'Something went wrong',
    errors: any[] = [],
    stack?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.errors = errors
    this.success = false

    if (stack) {
      this.stack = stack
    }
    else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}