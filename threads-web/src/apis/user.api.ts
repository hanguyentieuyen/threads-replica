import apiEndpoints from "~/constant/config"
import { Follow } from "~/types/follow.type"
import { User, UserFollowers, UserFollowing } from "~/types/user.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const userApi = {
  getMyProfile: () => axiosInstance.get<SuccessResponse<User>>(apiEndpoints.me),

  updateMyProfile: (body: {
    name?: string
    date_of_birth?: Date
    bio?: string
    location?: string
    website?: string
    username?: string
    avatar?: string
  }) => axiosInstance.patch<SuccessResponse<User>>(apiEndpoints.me, body),

  getUserProfile: (username: string) => axiosInstance.get<SuccessResponse<User>>(`${apiEndpoints.users}/${username}`),
  follow: (body: { followed_user_id: string }) =>
    axiosInstance.post<SuccessResponse<Follow>>(apiEndpoints.follow, body),
  unfollow: (user_id: string) => axiosInstance.delete<SuccessResponse<Follow>>(`${apiEndpoints.unfollow}/${user_id}`),
  getUserFollowers: ({ user_id, page, limit }: { user_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<UserFollowers>>(
      `${apiEndpoints.users}/${user_id}/followers/?${params.toString()}`
    )
  },
  getUserFollowing: ({ user_id, page, limit }: { user_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<UserFollowing>>(
      `${apiEndpoints.users}/${user_id}/following/?${params.toString()}`
    )
  }
}
