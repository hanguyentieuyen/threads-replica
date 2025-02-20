import Joi from 'joi'

export const createCommentValidator = Joi.object({
  post_id: Joi.string().required(),
  parent_id: Joi.string().allow(null),
  content: Joi.string().required().min(1)
})
