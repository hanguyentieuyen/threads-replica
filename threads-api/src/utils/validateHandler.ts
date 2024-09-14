import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error.model'
import { NextFunction } from 'express'
import { Schema } from 'joi'

export const validateHandler = async (schemas: Schema, requestPayload: unknown, next: NextFunction) => {
  try {
    await schemas.validateAsync(requestPayload, { abortEarly: false })
    next() // Procced to the next middleware
  } catch (error) {
    // Call next with an error to trigger the error-handdling middleware
    next(
      new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: 'Failed Validation'
      })
    )
  }
}
