/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import apiEndpoints from "~/constant/config"
import { Follow } from "~/types/follow.type"
import { User, UserFollowers, UserFollowing, UsernameExist, Users } from "~/types/user.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const userApi = {
  checkExistUsername: (username: string) => {
    const params = new URLSearchParams({
      username
    })
    return axiosInstance.get<SuccessResponse<UsernameExist>>(apiEndpoints.user.checkExistUsername, {
      params
    })
  },
  getMyProfile: () => axiosInstance.get<SuccessResponse<User>>(apiEndpoints.user.getMyProfile),

  updateMyProfile: (body: {
    name?: string
    date_of_birth?: Date
    bio?: string
    location?: string
    website?: string
    username?: string
    avatar?: string
  }) => axiosInstance.patch<SuccessResponse<User>>(apiEndpoints.user.getMyProfile, body),

  getUserProfile: (username: string) =>
    axiosInstance.get<SuccessResponse<User>>(apiEndpoints.user.getUserProfile(username)),
  follow: (body: { followed_user_id: string }) =>
    axiosInstance.post<SuccessResponse<Follow>>(apiEndpoints.user.follow, body),
  unfollow: (user_id: string) => axiosInstance.delete<SuccessResponse<Follow>>(apiEndpoints.user.unfollow(user_id)),
  getUserFollowers: ({ user_id, page, limit }: { user_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<UserFollowers>>(apiEndpoints.user.getUserFollowers(user_id), {
      params
    })
  },
  getUserFollowing: ({ user_id, page, limit }: { user_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<UserFollowing>>(apiEndpoints.user.getUserFollowing(user_id), {
      params
    })
  },

  searchUsers: ({ query, page, limit }: { query: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<Users>>(apiEndpoints.user.search, {
      params
    })
  }
}
