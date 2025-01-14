import config from "~/constant/config"
import { Follow } from "~/types/follow.type"
import { User, UserFollowers, UserFollowing } from "~/types/user.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const userApi = {
  getMyProfile: () => http.get<SuccessResponse<User>>(config.me),

  updateMyProfile: (body: {
    name?: string
    date_of_birth?: Date
    bio?: string
    location?: string
    website?: string
    username?: string
    avatar?: string
  }) => http.patch<SuccessResponse<User>>(config.me, body),

  getUserProfile: (username: string) => http.get<SuccessResponse<User>>(`${config.users}/${username}`),
  follow: (body: { followed_user_id: string }) => http.post<SuccessResponse<Follow>>(config.follow, body),
  unfollow: (user_id: string) => http.delete<SuccessResponse<Follow>>(`${config.unfollow}/${user_id}`),
  getUserFollowers: ({ user_id, page, limit }: { user_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return http.get<SuccessResponse<UserFollowers>>(`${config.users}/${user_id}/followers/?${params.toString()}`)
  },
  getUserFollowing: ({ user_id, page, limit }: { user_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return http.get<SuccessResponse<UserFollowing>>(`${config.users}/${user_id}/following/?${params.toString()}`)
  }
}
