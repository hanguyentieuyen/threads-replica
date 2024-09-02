import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const createPostValidator = validate(checkSchema({}))
