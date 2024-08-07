import express from 'express'
import { body, validationResult, ContextRunner, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/schemas/Errors.schema'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)
    // Ko có lỗi thì next request
    if (errors.isEmpty()) {
      return next()
    }

    const errorsObject = errors.mapped()
    const entityErrors = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Trả về lỗi ko phải lỗi do validate (422)
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        //errorsObject[key] = errorsObject[key].msg
        return next(msg)
      }
      entityErrors.errors[key] = errorsObject[key]
    }
    //console.log(errorsObject)
    // If not error then next

    next(entityErrors)
  }
}
