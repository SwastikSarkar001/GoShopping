import { NextFunction, Request, Response } from "express"

type asyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

const catchErrors = (controller: asyncController): asyncController =>
  async (req, res, next) => {
  try {
    await controller(req, res, next)
  }
  catch (err) {
    next(err)
  }
}

export default catchErrors