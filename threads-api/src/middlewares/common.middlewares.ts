import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ErrorWithStatus } from '~/models/schemas/Errors.schema'
import { envConfig } from '~/utils/config'
import { verifyToken } from '~/utils/jwt'
import { capitalize } from 'lodash'
import { pick } from 'lodash'

export const verifyAccessToken = async (accessToken: string, req?: Request) => {
  if (!accessToken) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  try {
    const decodedAuthorization = await verifyToken({
      token: accessToken,
      secretOrPublicKey: envConfig.jwtSecretAccessToken
    })
    if (req) {
      ;(req as Request).decodedAuthorization = decodedAuthorization
    }
    return true
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
  }
}

type FilterKeys<T> = Array<keyof T>
export const filterMiddleware =
  <T>(filterKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
