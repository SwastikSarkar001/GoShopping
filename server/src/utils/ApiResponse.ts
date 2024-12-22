import { BAD_REQUEST } from "constants/http"

export default class ApiResponse {
  statusCode: number
  data: any[]
  message: string
  success: boolean

  constructor(
    statusCode: number,
    data: any[],
    message: string = 'Success',
  ) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < BAD_REQUEST
  }
}