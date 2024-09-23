import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error.model'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody,
  GetUserProfileReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UnFollowReqBody,
  UpdateMyProfileReqBody
} from '~/models/requestType/User.requests'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { envConfig } from '~/utils/config'
import { hashPassword } from '~/utils/hash'
import { verifyToken } from '~/utils/jwt'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const { email, password } = req.validateData
  const hashedPassword = hashPassword(password)
  // Check if the user exists in the database
  const user = await databaseService.users.findOne({ email, password: hashedPassword })
  if (user === null) {
    throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
  }
  const userId = user._id as ObjectId
  const data = await usersService.login({ user_id: userId.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  // Check if the email exists in the database
  const isExistEmail = await usersService.checkEmailExist(req.validateData.email)
  if (isExistEmail) {
    throw new Error('Email already exists')
  }
  const data = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const data = await usersService.logout(refresh_token)
  return res.json(data)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const user = await databaseService.users.findOne({ email: req.validateData.email })
  if (user === null) {
    throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
  }
  const data = await usersService.forgotPassword({
    user_id: (user._id as ObjectId).toString(),
    verify: user.verify,
    email: user.email
  })
  return res.json(data)
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

    // Find the user by ID
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
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
  const data = await usersService.resetPassword({ user_id, password })

  return res.json(data)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decodedAuthorization
  const { old_password, password } = req.validateData
  // Check if user exists
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
  }
  // Check password on db is match with old password
  const { password: currentPassword } = user
  const isMatch = hashPassword(old_password) === currentPassword
  if (!isMatch) {
    throw new Error(USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH)
  }
  const data = await usersService.changePassword({ user_id, password })
  return res.json(data)
}

export const getMyProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload

  const data = await usersService.getMyProfile(user_id)
  return res.json(data)
}

export const updateMyProfileController = async (
  req: Request<ParamsDictionary, any, UpdateMyProfileReqBody>,
  res: Response
) => {
  const payload = req.body
  const { user_id } = req.decodedAuthorization as TokenPayload
  const userData = await usersService.updateMyProfile({ user_id, payload })
  return res.json({
    data: userData,
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS
  })
}

export const getUserProfileController = async (req: Request<GetUserProfileReqBody>, res: Response) => {
  const { username } = req.params
  const data = await usersService.getUserProfile(username)
  return res.json(data)
}

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { followed_user_id } = req.body
  const data = await usersService.follow({ user_id, followed_user_id })
  return res.json(data)
}

export const unFollowController = async (req: Request<UnFollowReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const data = await usersService.unfollow({ user_id, followed_user_id })
  return res.json(data)
}
