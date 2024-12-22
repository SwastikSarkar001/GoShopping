import { ErrorRequestHandler } from "express";
import ApiError from "utils/ApiError";
import ApiResponse from "utils/ApiResponse";

const errorHandler: ErrorRequestHandler = (error: ApiError, req, res, next) => {
  console.error()
  console.error(error.stack)
  res.status(error.statusCode).json(
    new ApiResponse(error.statusCode, error.data, error.message)
  )
}

export default errorHandler