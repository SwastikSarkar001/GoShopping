import { NextFunction, Request, RequestHandler, Response } from "express"
import ApiError from "./ApiError"

type asyncApiHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>
  
const asyncHandler = (controller: asyncApiHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch((err: ApiError) => next(err))
  }
}

export default asyncHandler