import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody,
  GetUserProfileReqBody,
  LikeReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UnFollowReqBody,
  UnLikeReqBody,
  UpdateMyProfileReqBody
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

export const likeController = async (req: Request<ParamsDictionary, any, LikeReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { liked_post_id } = req.body
  const data = await usersService.like({ user_id, liked_post_id })
  return res.json(data)
}

export const unLikeController = async (req: Request<ParamsDictionary, any, UnLikeReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { liked_post_id } = req.params
  const data = await usersService.unlike({ user_id, liked_post_id })
  return res.json(data)
}
