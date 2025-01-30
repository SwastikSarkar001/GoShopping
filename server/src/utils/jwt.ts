import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY } from "constants/env"
import jwt, { SignOptions } from 'jsonwebtoken'

export type AccessTokenPayload = {
  userid: string
  sessionid: string
}

export type RefreshTokenPayload = {
  sessionid: string
}

type SignOptionsAndSecret = SignOptions & { secret: string }

const AccessTokenSignOptions: SignOptionsAndSecret = {
  secret: ACCESS_TOKEN_SECRET,
  expiresIn: ACCESS_TOKEN_EXPIRY
}

const RefreshTokenSignOptions: SignOptionsAndSecret = {
  secret: REFRESH_TOKEN_SECRET,
  expiresIn: REFRESH_TOKEN_EXPIRY
}

const defaults: SignOptions = {
  audience: 'eazzybizz.com',
}

const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...rest } = options || (payload.hasOwnProperty('userid')) ? AccessTokenSignOptions : RefreshTokenSignOptions
  return jwt.sign(payload, secret, { ...defaults, ...rest })
}

export const verifyToken = (
  token: string,
  options: SignOptionsAndSecret
) => {
  const { secret, ...rest } = options
  return jwt.verify(token, secret, { ...defaults, ...rest })
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
  return signToken(payload, AccessTokenSignOptions)
}

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
  return signToken(payload, RefreshTokenSignOptions)
}