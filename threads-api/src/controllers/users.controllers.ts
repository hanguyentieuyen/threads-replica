/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { USERS_MESSAGES } from '~/constants/messages'

import {
  FollowReqBody,
  GetUserFollowersReqBody,
  GetUserFollowingReqBody,
  GetUserProfileReqBody,
  TokenPayload,
  UnFollowReqBody,
  UpdateMyProfileReqBody
} from '~/models/requestType/User.requests'
import usersService from '~/services/users.services'

export const usernameController = async (req: Request, res: Response) => {
  const { username } = req.query
  const isExistUsername = await usersService.checkUsernameExist(username as string)
  return res.json({
    data: {
      exist: isExistUsername
    }
  })
}

export const getMyProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload

  const myProfileData = await usersService.getMyProfile(user_id)
  return res.json({
    data: myProfileData,
    message: USERS_MESSAGES.GET_ME_SUCCESS
  })
}

export const updateMyProfileController = async (
  req: Request<ParamsDictionary, any, UpdateMyProfileReqBody>,
  res: Response
) => {
  const payload = req.body
  const { user_id } = req.decodedAuthorization as TokenPayload
  const userData = await usersService.updateMyProfile({ user_id, payload })
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    data: userData
  })
}

export const getUserProfileController = async (req: Request<GetUserProfileReqBody>, res: Response) => {
  const { username } = req.params
  const userData = await usersService.getUserProfile(username)
  return res.json({
    data: userData,
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS
  })
}

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { followed_user_id } = req.validateData
  const data = await usersService.follow({ user_id, followed_user_id })
  return res.json(data)
}

export const unFollowController = async (req: Request<UnFollowReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const data = await usersService.unfollow({ user_id, followed_user_id })
  return res.json(data)
}

export const getUserFollowersController = async (req: Request<GetUserFollowersReqBody>, res: Response) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.getUserFollowers({ user_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      user_followers: data.userFollowers
    },
    message: USERS_MESSAGES.GET_USER_FOLLOWERS_SUCCESS
  })
}

export const getUserFollowingController = async (req: Request<GetUserFollowingReqBody>, res: Response) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.getUserFollowing({ user_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      user_following: data.userFollowing
    },
    message: USERS_MESSAGES.GET_USER_FOLLOWING_SUCCESS
  })
}

export const getUserBookmarksController = async (req: Request<GetUserFollowingReqBody>, res: Response) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.getUserBookmarks({ user_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      user_bookmark_posts: data.userBookmarks
    },
    message: USERS_MESSAGES.GET_USER_BOOKMARKS_SUCCESS
  })
}

export const searchUsersController = async (req: Request, res: Response) => {
  const { query } = req.validateData
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.searchUsers({ username: query, limit, page })
  return res.json({
    data: {
      page: page,
      limit: limit,
      total_page: Math.ceil(data.total / limit),
      users: data.users
    }
  })
}
