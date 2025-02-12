import { UNAUTHORIZED } from 'constants/http';
import { Request, Response, NextFunction } from 'express';
import ApiError from 'utils/ApiError';
import { AccessTokenPayload, AccessTokenSignOptions, RefreshTokenPayload, RefreshTokenSignOptions, verifyToken } from 'utils/jwt';

/**
 * Middleware to protect routes that require a valid access token.
 * 
 * This middleware checks for the presence of an access token in the request cookies or 
 * authorization headers. If a valid token is found, it verifies the token and attaches 
 * the decoded data to the request body. If the token is missing or invalid, it throws 
 * an unauthorized error.
 * 
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function in the stack.
 * 
 * @throws {ApiError} If the access token is not provided or is invalid.
 */
export const accessProtectedRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = (req?.cookies["access_token"] as string) || (req.headers['authorization']?.split(' ')[1])
    if (accessToken) {
      try {
        const data = verifyToken(accessToken, AccessTokenSignOptions) as AccessTokenPayload
        req.body.verifiedData = data
        next()
      }
      catch (error) {
        throw new ApiError(UNAUTHORIZED, 'Access Token is invalid')
      }
    }
    else {
      throw new ApiError(UNAUTHORIZED, 'Access Token is not provided')
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Middleware to protect routes that require a valid refresh token.
 * 
 * This middleware checks for the presence of a refresh token in the request cookies or 
 * authorization headers. If a valid token is found, it verifies the token and attaches 
 * the decoded data to the request body. If the token is missing or invalid, it throws 
 * an unauthorized error.
 * 
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 * @param next - The next middleware function in the stack.
 * 
 * @throws {ApiError} If the refresh token is not provided or is invalid.
 */
export const refreshProtectedRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = (req?.cookies["refresh_token"] as string) || (req.headers['authorization']?.split(' ')[1])
    if (refreshToken) {
      try {
        const data = verifyToken(refreshToken, RefreshTokenSignOptions) as RefreshTokenPayload
        req.body.verifiedData = data
        next()
      }
      catch (error) {
        throw new ApiError(UNAUTHORIZED, 'Refresh Token is invalid')
      }
    }
    else {
      throw new ApiError(UNAUTHORIZED, 'Refresh Token is not provided')
    }
  } catch (error) {
    next(error)
  }
}