import { USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
import Joi from 'joi'

const passwordSchema = Joi.string()
  .min(6)
  .max(50)
  .required()
  .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/) // ensures the password contains at least 1 lowercase letter, 1 number, and 1 symbol.
  .messages({
    'string.empty': USERS_MESSAGES.PASSWORD_IS_REQUIRED,
    'string.base': USERS_MESSAGES.PASSWORD_MUST_BE_STRING,
    'string.min': USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
    'string.max': USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
    'string.pattern.base': USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  })

const confirmPasswordSchema = Joi.string()
  .min(6)
  .max(50)
  .required()
  .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/) // Matches strong password requirements
  .valid(Joi.ref('password')) // Ensure confirmPassword matches password
  .messages({
    'string.empty': USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
    'string.base': USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
    'string.min': USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
    'string.max': USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
    'string.pattern.base': USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRING,
    'any.only': USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD
  })

const forgotPasswordTokenSchema = Joi.string().trim().messages({
  'string.empty': USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
})

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

export const accessTokenValidator = Joi.object({
  authorization: Joi.string()
    .trim()
    .pattern(/^Bearer\s.+$/) // the Bearer format
    .messages({
      'string.base': 'Authorization header must be a string',
      'string.pattern.base': 'Authorization header must follow the Bearer token format',
      'any.invalid': 'Invalid or missing access token'
    })
})

export const refreshTokenValidator = Joi.object({
  refresh_token: Joi.string()
    .trim()
    .required()
    .custom((value) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      return value // Validation passes if everything is correct
    })
    .messages({
      'string.empty': USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
      'any.required': USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
      'any.invalid': USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST
    })
})

export const loginValidator = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.email': USERS_MESSAGES.EMAIL_IS_INVALID,
    'string.empty': USERS_MESSAGES.EMAIL_IS_REQUIRED,
    'any.required': USERS_MESSAGES.EMAIL_IS_REQUIRED
  }),

  password: Joi.string()
    .required()
    .min(6)
    .max(50)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])')) // ensure the password has at least one lowercase letter, one number, and one symbol.
    .messages({
      'string.empty': USERS_MESSAGES.PASSWORD_IS_REQUIRED,
      'string.min': USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
      'string.max': USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
      'string.pattern.base': USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
    })
})

export const registerValidator = Joi.object({
  name: Joi.string().trim().min(1).max(10).required().messages({
    'string.empty': USERS_MESSAGES.NAME_IS_REQUIRED,
    'string.base': USERS_MESSAGES.NAME_MUST_BE_STRING,
    'string.min': USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
    'string.max': USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
    'any.required': USERS_MESSAGES.NAME_IS_REQUIRED
  }),

  email: Joi.string().trim().email().required().messages({
    'string.empty': USERS_MESSAGES.EMAIL_IS_REQUIRED,
    'string.email': USERS_MESSAGES.EMAIL_IS_INVALID,
    'any.required': USERS_MESSAGES.EMAIL_IS_REQUIRED
  }),

  password: Joi.string()
    .min(6)
    .required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])'))
    .messages({
      'string.empty': USERS_MESSAGES.PASSWORD_IS_REQUIRED,
      'string.min': USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
      'string.pattern.base': USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
      'any.required': USERS_MESSAGES.PASSWORD_IS_REQUIRED
    }),

  confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD,
    'string.empty': USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED,
    'any.required': USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  }),

  date_of_birth: Joi.date().iso().required().messages({
    'date.base': USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601,
    'date.format': USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601,
    'any.required': USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
  })
})

export const verifyEmailTokenValidator = Joi.object({
  verify_email_token: Joi.string().required().trim().messages({
    'string.verify_email_token': USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
  })
})

export const forgotPasswordValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': USERS_MESSAGES.EMAIL_IS_REQUIRED,
      'string.email': USERS_MESSAGES.EMAIL_IS_INVALID
    })
})

export const verifyForgotPasswordValidator = Joi.object({
  forgot_password_token: Joi.string().required().trim().messages({
    'string.forgot_password_token': USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
  })
})

export const resetPasswordValidator = Joi.object({
  password: passwordSchema,
  confirm_password: confirmPasswordSchema,
  forgot_password_token: forgotPasswordTokenSchema
})

export const changePasswordValidator = Joi.object({
  old_password: passwordSchema,
  password: passwordSchema,
  confirm_password: confirmPasswordSchema
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
