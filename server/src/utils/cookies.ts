import { NODE_ENV } from "constants/env";
import { CookieOptions } from "express";

export const accessTokenOptions: CookieOptions = {
  secure: NODE_ENV.toLowerCase() === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 1) // 1 hour
}

export const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV.toLowerCase() === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days,
  // path: `api/${API_VERSION}/auth`
}