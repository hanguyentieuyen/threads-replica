/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { COMMENTS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error.model'

export const commentIdValidator = Joi.object({
  comment_id: Joi.string()
    .required()
    .trim()
    .custom((value) => {
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: COMMENTS_MESSAGES.INVALID_COMMENT,
          status: HTTP_STATUS.NOT_FOUND
        })
      }
      return value
    })
    .messages({
      'string.base': COMMENTS_MESSAGES.INVALID_COMMENT,
      'string.empty': COMMENTS_MESSAGES.COMMENT_ID_IS_REQUIRED
    })
})

export const createCommentValidator = Joi.object({
  post_id: Joi.string().required(),
  parent_id: Joi.string().allow(null),
  content: Joi.string().required().min(1)
})

export const updateCommentValidator = Joi.object({
  content: Joi.string().required().min(1)
})
