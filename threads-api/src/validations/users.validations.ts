import { checkSchema, ParamSchema } from 'express-validator'
import { NextFunction, Request, Response } from 'express'
import { POSTS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/hash'
import { validate } from '~/utils/validation'
import { verifyAccessToken } from './common.validations'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { capitalize, isLength } from 'lodash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { verifyToken } from '~/utils/jwt'
import { envConfig } from '~/utils/config'
import { ObjectId } from 'mongodb'
import { TokenPayload } from '~/models/requestType/User.requests'
import Joi from 'joi'
import { validateHandler } from '~/utils/validateHandler'

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

const forgotPasswordTokenSchema = Joi.string()
  .trim()
  .custom(async (value, helpers) => {
    if (!value) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    try {
      const decodedForgotPasswordToken = await verifyToken({
        token: value,
        secretOrPublicKey: envConfig.jwtSecretForgotPasswordToken as string
      })

      const { user_id } = decodedForgotPasswordToken
      const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

      if (!user) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_FOUND,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      if (user.forgot_password_token !== value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }

      helpers.state.ancestors[0].decodedForgotPasswordToken = decodedForgotPasswordToken // Set the decoded token in request object
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new ErrorWithStatus({
          message: capitalize(error.message),
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      throw error
    }

    return true // Validation passes if all checks succeed
  })
  .messages({
    'string.empty': USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
  })

const userIdSchema = Joi.string()
  .custom(async (value, helpers) => {
    // Check if the user ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_USER_ID,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    // Look up the user in the database
    const followed_user = await databaseService.users.findOne({
      _id: new ObjectId(value)
    })

    // Check if the user exists
    if (!followed_user) {
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

export const accessTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const accessTokenSchema = Joi.object({
    Authorization: Joi.string()
      .trim()
      .custom(async (value, helpers) => {
        // Extract the token after the 'Bearer' part
        const accessToken = value.split(' ')[1]

        if (!accessToken) {
          return helpers.error('any.invalid') // Invalid token format
        }

        try {
          // Validate the access token
          await verifyAccessToken(accessToken, helpers.state.ancestors[0] as Request)
        } catch (error) {
          return helpers.error('any.invalid') // Return invalid if verification fails
        }

        return value // Return the value if it's valid
      })
      .messages({
        'string.base': 'Authorization header must be a string',
        'any.invalid': 'Invalid or missing access token'
      })
  })

  await validateHandler(accessTokenSchema, req.body, next)
}

export const refreshTokenValidator = async (req: Request, res: Response, next: NextFunction) => {
  const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string()
      .trim()
      .required()
      .custom(async (value, helpers) => {
        if (!value) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }

        try {
          const [decodedRefreshToken, existedRefreshToken] = await Promise.all([
            verifyToken({ token: value, secretOrPublicKey: envConfig.jwtSecretRefreshToken }),
            databaseService.refreshTokens.findOne({ token: value })
          ])

          if (!existedRefreshToken) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          // Add the decoded refresh token to the request object
          ;(helpers.state.ancestors[0] as Request).decodedAuthorization = decodedRefreshToken
        } catch (error) {
          if (error instanceof JsonWebTokenError) {
            throw new ErrorWithStatus({
              message: capitalize(error.message),
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          throw error
        }

        return value // Validation passes if everything is correct
      })
      .messages({
        'string.empty': USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        'any.required': USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
        'any.invalid': USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST
      })
  })
  await validateHandler(refreshTokenSchema, req.body, next)
}

export const loginValidator = async (req: Request, res: Response, next: NextFunction) => {
  const loginSchema = Joi.object({
    email: Joi.string()
      .trim()
      .email()
      .required()
      .custom(async (value, helpers) => {
        const { password } = helpers.state.ancestors[0] as { password: string } // Get password from the request body
        const hashedPassword = hashPassword(password)

        // Check if the user exists in the database
        const user = await databaseService.users.findOne({ email: value, password: hashedPassword })
        if (!user) {
          return helpers.error('any.invalid', { message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT })
        }

        // Attach user to request object
        ;(helpers.state.ancestors[0] as Request).user = user

        return value
      })
      .messages({
        'string.email': USERS_MESSAGES.EMAIL_IS_INVALID,
        'string.empty': USERS_MESSAGES.EMAIL_IS_REQUIRED,
        'any.required': USERS_MESSAGES.EMAIL_IS_REQUIRED,
        'any.invalid': USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT
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
  await validateHandler(loginSchema, req.body, next)
}

export const registerValidator = async (req: Request, res: Response, next: NextFunction) => {
  const registerSchema = Joi.object({
    name: Joi.string().trim().min(1).max(10).required().messages({
      'string.empty': USERS_MESSAGES.NAME_IS_REQUIRED,
      'string.base': USERS_MESSAGES.NAME_MUST_BE_STRING,
      'string.min': USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
      'string.max': USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
      'any.required': USERS_MESSAGES.NAME_IS_REQUIRED
    }),

    email: Joi.string()
      .trim()
      .email()
      .required()
      .external(async (value) => {
        const isExistEmail = await usersService.checkEmailExist(value)
        if (isExistEmail) {
          throw new Error('Email already exists')
          // throw new Joi.ValidationError('Email already exists', [
          //   {
          //     message: 'Email already exists',
          //     path: ['email'],
          //     type: 'any.exists',
          //     context: { label: 'email', value }
          //   }
          // ])
        }
      })
      .messages({
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
  await validateHandler(registerSchema, req.body, next)
}

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user === null) {
              throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
            }
            req.user = user
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schemas = Joi.object({
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    forgot_password_token: forgotPasswordTokenSchema
  })

  await validateHandler(schemas, req.body, next)
}

export const changePasswordValidator = async (req: Request, res: Response, next: NextFunction) => {
  const changePasswordSchema = Joi.object({
    old_password: Joi.string()
      .required()
      .external(async (value, helpers) => {
        // Access req from helpers.context, passed explicitly
        //const { req } = helpers.context;
        const { user_id } = req.decodedAuthorization

        // Check if user exists
        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
        if (!user) {
          // Use helpers.error to generate a validation error
          return helpers.error('any.not_found', { message: USERS_MESSAGES.USER_NOT_FOUND })
        }

        // Check if the old password matches
        const isMatch = hashPassword(value) === user.password
        if (!isMatch) {
          return helpers.error('any.invalid', { message: USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH })
        }

        return true // Return true if everything is valid
      })
      .messages({
        'string.empty': USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH
      }),

    password: passwordSchema,
    confirm_password: confirmPasswordSchema
  })

  // Pass req explicitly in validation context
  await validateHandler(changePasswordSchema, req.body, next)
}

export const followValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    followed_user_id: userIdSchema
  })
  await validateHandler(schema, req.body, next)
}

export const unFollowValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    user_id: userIdSchema
  })
  await validateHandler(schema, req.params, next)
}
