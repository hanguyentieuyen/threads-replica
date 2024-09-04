import { validate } from '~/utils/validation'
import { checkSchema, ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/schemas/Errors.schema'
import databaseService from '~/services/database.services'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'

const postIdSchema: ParamSchema = {
  custom: {
    options: async (value, { req }) => {
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.INVALID_POST_ID,
          status: HTTP_STATUS.NOT_FOUND
        })
      }

      const liked_post_id = await databaseService.posts.findOne({
        _id: new ObjectId(value)
      })

      if (liked_post_id === null) {
        throw new ErrorWithStatus({
          message: POSTS_MESSAGES.POST_NOT_FOUND,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
    }
  }
}

export const likeValidator = validate(
  checkSchema(
    {
      liked_post_id: postIdSchema
    },
    ['body']
  )
)

export const unlikeValidator = validate(
  checkSchema(
    {
      liked_post_id: postIdSchema
    },
    ['params']
  )
)

export const createPostValidator = validate(checkSchema({}))
