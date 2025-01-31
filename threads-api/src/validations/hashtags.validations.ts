import Joi from 'joi'
import { HASHTAGS_MESSAGES } from '~/constants/messages'

export const searchHashTagsValidator = Joi.object({
  search: Joi.string().messages({
    'string.base': HASHTAGS_MESSAGES.SEARCH_CONTENT_MUST_BE_STRING
  })
})
