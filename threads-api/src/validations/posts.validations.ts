import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/error.model'
import databaseService from '~/services/database.services'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'
import { convertEnumToArray } from '~/utils/common'
import { MediaType, PostAudience, PostType } from '~/constants/enum'
import { isEmpty } from 'lodash'
import Joi from 'joi'
const postTypes = convertEnumToArray(PostType)
const postAudience = convertEnumToArray(PostAudience)
const mediaTypes = convertEnumToArray(MediaType)

const postIdSchema = Joi.string().custom(async (value) => {
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

  return value // Return value when validation passes
})

export const likeValidator = Joi.object({
  post_id: postIdSchema
})

export const unlikeValidator = Joi.object({
  liked_post_id: postIdSchema
})

export const paginationValidator = Joi.object({
  limit: Joi.number().integer().min(1).max(100).messages({
    'number.base': 'Limit phải là một số',
    'number.min': 'Limit phải lớn hơn hoặc bằng 1',
    'number.max': 'Limit phải nhỏ hơn hoặc bằng 100'
  }),

  page: Joi.number().integer().min(1).messages({
    'number.base': 'Page phải là một số',
    'number.min': 'Page phải lớn hơn hoặc bằng 1'
  })
})

export const postValidator = Joi.object({
  post_id: Joi.string().custom((value) => {
    if (!ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: POSTS_MESSAGES.INVALID_POST_ID
      })
    }
    return value
  })
})

export const createPostValidator = Joi.object({
  type: Joi.string()
    .valid(...postTypes)
    .required()
    .messages({
      'any.only': POSTS_MESSAGES.INVALID_POST,
      'any.required': POSTS_MESSAGES.INVALID_POST
    }),

  audience: Joi.string()
    .valid(...postAudience)
    .required()
    .messages({
      'any.only': POSTS_MESSAGES.INVALID_AUDIENCE,
      'any.required': POSTS_MESSAGES.INVALID_AUDIENCE
    }),

  hashtags: Joi.array().items(Joi.string()).required().messages({
    'array.includes': POSTS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING
  }),

  mentions: Joi.array()
    .items(
      Joi.string().custom((value, helpers) => {
        if (!ObjectId.isValid(value)) {
          return helpers.error(POSTS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
        }
        return value
      })
    )
    .required()
    .messages({
      'array.includes': POSTS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID
    }),

  medias: Joi.array()
    .items(
      Joi.object({
        url: Joi.string().required(),
        type: Joi.string()
          .valid(...mediaTypes)
          .required()
      }).messages({
        'object.base': POSTS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT
      })
    )
    .required(),

  content: Joi.string()
    .allow('')
    .custom((value, helpers) => {
      const { type, hashtags, mentions } = helpers.state.ancestors[0]

      if (type === PostType.RePost && isEmpty(hashtags) && isEmpty(mentions) && value === '') {
        return helpers.error(POSTS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
      }

      if (type === PostType.Post && value !== '') {
        return helpers.error(POSTS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
      }

      return value
    })
    .messages({
      'any.custom': POSTS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING
    }),

  parent_id: Joi.alternatives()
    .conditional('type', {
      is: PostType.RePost,
      then: Joi.string()
        .custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.error(POSTS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_POST_ID)
          }
          return value
        })
        .required(),
      otherwise: Joi.allow(null)
    })
    .messages({
      'any.custom': POSTS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_POST_ID
    })
})

export const getPostChildrenValidator = Joi.object({
  post_type: Joi.string()
    .valid(...Object.values(PostType))
    .required()
    .messages({
      'any.only': POSTS_MESSAGES.INVALID_TYPE,
      'any.required': 'Post type is required'
    })
})
