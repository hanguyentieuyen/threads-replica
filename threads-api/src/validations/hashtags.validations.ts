/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import Joi from 'joi'
import { HASHTAGS_MESSAGES } from '~/constants/messages'

export const searchHashTagsValidator = Joi.object({
  search: Joi.string().messages({
    'string.base': HASHTAGS_MESSAGES.SEARCH_CONTENT_MUST_BE_STRING
  })
})

export const createHashTagsValidator = Joi.object({
  hashtag: Joi.string().messages({
    'string.base': HASHTAGS_MESSAGES.HASHTAG_MUST_BE_STRING
  })
})
