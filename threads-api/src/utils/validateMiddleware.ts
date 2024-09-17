import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error.model'
import { NextFunction, Request, Response } from 'express'
import Joi, { Schema } from 'joi'

export const validateMiddleware = (schemas: Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await schemas.validateAsync(req.body, { abortEarly: false })
      req.validateData = value
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
