import { ObjectId } from 'mongodb'
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ChangePasswordReqBody,
  ForgotPasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  VerifyEmailTokenReqBody,
  VerifyForgotPasswordReqBody
} from '~/models/requestType/User.requests'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/hash'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error.model'
import { envConfig } from '~/utils/config'
import { verifyToken } from '~/utils/jwt'
import databaseService from '~/services/database.services'
import authService from '~/services/auth.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const { email, password } = req.validateData
  const hashedPassword = hashPassword(password)

  // Check if the user exists in the database
  const user = await authService.getUserByEmailPassword({ email, hashedPassword })
  if (user === null) {
    throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
  }
  const userId = user._id as ObjectId
  const data = await authService.login({ user_id: userId.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data
  })
}

export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await authService.oauth(code as string)
  const urlRedirect = `${envConfig.clientRedirectCallback}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&verify=${result.verify}`
  return res.redirect(urlRedirect)
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  // Check if the email exists in the database
  const isExistUsername = await usersService.checkUsernameExist(req.validateData.username)
  const isExistEmail = await authService.checkEmailExist(req.validateData.email)

  if (isExistEmail) {
    throw new Error('Email already exists')
  }

  if (isExistUsername) {
    throw new Error('Username already exists')
  }

  const data = await authService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailTokenReqBody>,
  res: Response
) => {
  const { verify_email_token } = req.validateData
  // decode verify_email_token
  try {
    const decodedVerifyEmailToken = await verifyToken({
      token: verify_email_token,
      secretOrPublicKey: envConfig.jwtSecretVerifyMailToken
    })

    ;(req as Request).decodedVerifyEmailToken = decodedVerifyEmailToken
  } catch (error) {
    throw new ErrorWithStatus({
      message: capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  const { user_id } = req.decodedVerifyEmailToken as TokenPayload

  const user = await authService.getUserById(user_id)
  // Case 0: user not found
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  // Case 1: email is verified
  if (user.verify_email_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  // Case 2: email is not verified
  const data = authService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    data
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const data = await authService.logout(refresh_token)
  return res.json(data)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.validateData

  try {
    //verify token and check its existence in the database
    const [decodedRefreshToken, existedRefreshToken] = await Promise.all([
      verifyToken({ token: refresh_token, secretOrPublicKey: envConfig.jwtSecretRefreshToken }),
      databaseService.refreshTokens.findOne({ token: refresh_token })
    ])

    if (!existedRefreshToken) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const { user_id, verify, exp } = decodedRefreshToken

    const data = await authService.refreshToken({ user_id, refresh_token, verify, exp })
    return res.json({
      message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      data
    })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    throw error
  }
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const user = await authService.getUserByEmail({ email: req.validateData.email })
  if (user === null) {
    throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
  }
  const data = await authService.forgotPassword({
    user_id: (user._id as ObjectId).toString(),
    verify: user.verify,
    email: user.email
  })
  return res.json(data)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response
) => {
  const { forgot_password_token } = req.validateData
  try {
    // decode
    const decodedForgotPasswordToken = await verifyToken({
      token: forgot_password_token,
      secretOrPublicKey: envConfig.jwtSecretForgotPasswordToken
    })

    const { user_id } = decodedForgotPasswordToken
    const user = await authService.getUserById(user_id)
    // check user exist
    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    // compare token value on db and token value from req.body
    if (user.forgot_password_token !== req.body.forgot_password_token) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    // override decodedForgotPasswordToken of req
    req.decodedForgotPasswordToken = decodedForgotPasswordToken
    return res.json({
      message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
  }
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { forgot_password_token, password } = req.validateData

  if (!forgot_password_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  try {
    // Verify the forgot password token
    const decodedToken = await verifyToken({
      token: forgot_password_token,
      secretOrPublicKey: envConfig.jwtSecretForgotPasswordToken as string
    })

    const { user_id } = decodedToken

    const user = await authService.getUserById(user_id)
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    // Validate the token matches the stored user token
    if (user.forgot_password_token !== forgot_password_token) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    req.decodedForgotPasswordToken = decodedToken // Store decoded token in request object
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    throw error
  }

  // Reset the user's password
  const { user_id } = req.decodedForgotPasswordToken as TokenPayload
  const data = await authService.resetPassword({ user_id, password })

  return res.json(data)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decodedAuthorization
  const { old_password, password } = req.validateData
  // Check if user exists
  const user = await authService.getUserById(user_id)
  if (!user) {
    throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
  }
  // Check password on db is match with old password
  const { password: currentPassword } = user
  const isMatch = hashPassword(old_password) === currentPassword
  if (!isMatch) {
    throw new Error(USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH)
  }
  const data = await authService.changePassword({ user_id, password })
  return res.json(data)
}
