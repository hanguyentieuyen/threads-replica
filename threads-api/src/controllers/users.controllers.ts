import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ChangePasswordReqBody,
  ForgotPasswordReqBody,
  GetUserProfileReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload
} from '~/models/requestType/User.requests'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const userId = user._id as ObjectId
  const data = await usersService.login({ user_id: userId.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
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
  const { _id, verify, email } = req.user as User
  const data = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify, email })
  return res.json(data)
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decodedForgotPasswordToken as TokenPayload
  const { password } = req.body
  const data = await usersService.resetPassword({ user_id, password })
  return res.json(data)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decodedAuthorization
  const { password } = req.body
  const data = await usersService.changePassword({ user_id, password })
  return res.json(data)
}

export const getMyProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization
  const data = await usersService.getMyProfile(user_id)
  return res.json(data)
}

export const getUserProfileController = async (req: Request<GetUserProfileReqBody>, res: Response) => {
  const { username } = req.params
  const data = await usersService.getUserProfile(username)
  return res.json(data)
}
