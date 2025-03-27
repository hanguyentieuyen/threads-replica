/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import Joi from 'joi'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { POSTS_MESSAGES } from '~/constants/messages'

export const searchValidator = Joi.object({
  content: Joi.string().messages({
    'string.base': POSTS_MESSAGES.SEARCH_CONTENT_MUST_BE_STRING
  }),

  media_type: Joi.string()
    .valid(...Object.values(MediaTypeQuery)) // Validating media_type against MediaTypeQuery enum
    .optional()
    .messages({
      'any.only': `${POSTS_MESSAGES.MEDIA_TYPE_MUST_BE_ONE_OF_VALUES} ${Object.values(MediaTypeQuery).join(',')}`
    }),

  people_follow: Joi.number()
    .valid(...Object.values(PeopleFollow))
    .optional()
    .messages({
      'any.only': POSTS_MESSAGES.PEOPLE_FOLLOW_MUST_BE_0_OR_1
    })
})
