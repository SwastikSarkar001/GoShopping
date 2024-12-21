import { ErrorRequestHandler } from "express";
import ApiError from "utils/ApiError";

const errorHandler: ErrorRequestHandler = (error: ApiError, req, res, next) => {
  console.error(error.message, error.stack);
  res.status(error.statusCode).send(error.message)
}

export default errorHandler