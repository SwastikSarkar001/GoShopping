import { OK, UNAUTHORIZED } from "constants/http";
import { RequestHandler } from "express";

const registered: RequestHandler = (req, res, next) => {
  const sessionCookie = req.cookies['session_id']
  if (!sessionCookie) {
    res.status(UNAUTHORIZED).send('')
  }
  else {
    res.status(OK).send('')
    next()
  }
}

export default registered