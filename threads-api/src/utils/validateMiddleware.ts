import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error.model'
import { NextFunction, Request, Response } from 'express'
import Joi, { Schema } from 'joi'
import { verifyAccessToken } from '~/validations/common.validations'

export const validateMiddleware = (schemas: Schema, dataLocation: 'body' | 'headers' | 'params') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = dataLocation === 'headers' ? { authorization: req.headers.authorization } : req[dataLocation]
      // validate data with joi
      const value = await schemas.validateAsync(data, { abortEarly: false })
      req.validateData = value

      //  verify the access token
      if (dataLocation === 'headers') {
        const accessToken = value.authorization.split(' ')[1]

        const decodedAuthorization = await verifyAccessToken(accessToken)
        req.decodedAuthorization = decodedAuthorization
      }
      next() // Procced to the next middleware
    } catch (error) {
      console.log('Validate: ', error)
      // Check error from Joi
      if (error instanceof Joi.ValidationError) {
        next(
          new ErrorWithStatus({
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
            message: error.details.map((err) => err.message).join(', ') // Lấy các message từ lỗi
          })
        )
      } else {
        next(error)
      }
    }
  }
}
