import { NextFunction, Request, RequestHandler, Response } from "express"
import ApiResponse from "./ApiResponse"
import ApiError from "./ApiError"

type asyncHandlerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<ApiResponse>

// const asyncHandler = (controller: asyncHandlerType): asyncHandlerType =>
//   async (req, res, next) => {
//     try {
//       await controller(req, res, next)
//     }
//     catch (error) {
//       next(error)
//     }
//   }
  
const asyncHandler = (controller: asyncHandlerType): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch((err: ApiError) => next(err))
  }
}

  export default asyncHandler