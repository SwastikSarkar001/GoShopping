import { CONTINUE, UNAUTHORIZED } from "constants/http";
import { RequestHandler } from "express";
import ApiError from "utils/ApiError";

const registered: RequestHandler = (req, res, next) => {

  let testVar = true
  if (testVar) {
    res.status(CONTINUE)
    next()
  }
  else {
    throw new ApiError(UNAUTHORIZED, 'Unauthourized access by the user')
  }

  // const sessionCookie = req.cookies['session_id']
  // if (!sessionCookie) {
  //   res.status(UNAUTHORIZED).send('')
  // }
  // else {
  //   res.status(OK).send('')
  //   next()
  // }
}

export default registered