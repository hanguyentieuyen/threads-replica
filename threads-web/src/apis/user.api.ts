import config from "~/constant/config"
import { Follow } from "~/types/follow.type"
import { User } from "~/types/user.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const userApi = {
  getMyProfile: () => http.get(config.me),

  updateMyProfile: (body: {
    name: string
    date_of_birth: string
    bio: string
    location: string
    website: string
    username: string
    avatar: string
    cover_photo: string
  }) => http.patch<User>(config.me, body),

  getUserProfile: (username: string) => http.get<SuccessResponse<User>>(`${config.userName}/${username}`),
  follow: (body: { followed_user_id: string }) => http.post<SuccessResponse<Follow>>(config.follow, body),
  unfollow: (user_id: string) => http.delete<SuccessResponse<Follow>>(`${config.unfollow}/${user_id}`)
}
