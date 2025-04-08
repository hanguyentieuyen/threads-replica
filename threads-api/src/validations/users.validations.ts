/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const userIdSchema = Joi.string()
  .custom(async (value) => {
    // Check if the user ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_USER_ID,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Look up the user in the database
    const user = await databaseService.users.findOne({
      _id: new ObjectId(value)
    })

    // Check if the user exists
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return true // Return true if validation passes
  })
  .messages({
    'string.base': USERS_MESSAGES.INVALID_USER_ID
  })

export const followValidator = Joi.object({
  followed_user_id: userIdSchema
})

export const unFollowValidator = Joi.object({
  user_id: userIdSchema
})

export const usernameValidator = Joi.object({
  username: Joi.string().messages({
    'string.base': USERS_MESSAGES.USERNAME_QUERY_MUST_BE_STRING,
    'string.min': USERS_MESSAGES.USERNAME_LENGTH_MUST_BE_FROM_1_TO_100,
    'string.max': USERS_MESSAGES.USERNAME_LENGTH_MUST_BE_FROM_1_TO_100,
    'any.required': USERS_MESSAGES.USERNAME_IS_REQUIRED
  })
})

export const getUserFollowersValidator = Joi.object({ user_id: userIdSchema })
export const getUserFollowingValidator = Joi.object({ user_id: userIdSchema })
export const getUserBookmarksValidator = Joi.object({ user_id: userIdSchema })

export const searchUserValidator = Joi.object({
  query: Joi.string().messages({
    'string.base': USERS_MESSAGES.SEARCH_QUERY_MUST_BE_STRING
  })
})
