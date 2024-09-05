import { validate } from '~/utils/validation'
import { checkSchema, ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/schemas/Errors.schema'
import databaseService from '~/services/database.services'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'
import { convertEnumToArray } from '~/utils/common'
import { MediaType, PostAudience, PostType } from '~/constants/enum'
import { isEmpty } from 'lodash'

const postTypes = convertEnumToArray(PostType)
const postAudience = convertEnumToArray(PostAudience)
const mediaTypes = convertEnumToArray(MediaType)

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

export const createPostValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [postTypes],
        errorMessage: POSTS_MESSAGES.INVALID_POST
      }
    },
    audience: {
      isIn: {
        options: [postAudience],
        errorMessage: POSTS_MESSAGES.INVALID_AUDIENCE
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong array là string
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error(POSTS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong array là user_id
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error(POSTS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          // Yêu cầu mỗi phần tử trong array là Media Object
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
            })
          ) {
            throw new Error(POSTS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as PostType
          const hashtags = req.body.hashtags as string
          const mentions = req.body.mentions as string

          // nếu type là repost và ko có mentions và hashtags thì content phải là string và ko dc rỗng
          if ([PostType.RePost].includes(type) && isEmpty(hashtags) && isEmpty(mentions) && value === '') {
            throw new Error(POSTS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
          }
          // nêu type là tweet thì parent_id phải là null
          if (type === PostType.RePost && value !== '') {
            throw new Error(POSTS_MESSAGES.CONTENT_MUST_BE_EMPTY_STRING)
          }
          return true
        }
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as PostType
          // nếu type là repost thì parent_id phải là tweet_id của tweet cha
          if ([PostType.RePost].includes(type) && !ObjectId.isValid(value)) {
            throw new Error(POSTS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_POST_ID)
          }
          // nêu type là post thì parent_id phải là null
          if (type === PostType.Post && value !== null) {
            throw new Error(POSTS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_POST_ID)
          }
          return true
        }
      }
    }
  })
)
