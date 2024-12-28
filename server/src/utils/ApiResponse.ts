import { BAD_REQUEST, HttpStatusCode } from "constants/http"

/**
 * Represents a standardized API response.
 */
export default class ApiResponse {
  /**
   * The HTTP status code of the response.
   */
  statusCode: HttpStatusCode

  /**
   * The data payload of the response.
   */
  data: any[]

  /**
   * The message associated with the response.
   * Defaults to 'Success'.
   */
  message: string

  /**
   * Indicates whether the response is successful.
   */
  success: boolean

  /**
   * Creates an instance of ApiResponse.
   * @param statusCode - The HTTP status code of the response.
   * @param data - The data payload of the response.
   * @param message - The message associated with the response. Defaults to 'Success'.
   */
  constructor(
    statusCode: HttpStatusCode,
    data: any[],
    message: string = 'Success',
  ) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < BAD_REQUEST
  }
}