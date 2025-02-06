import config from "~/constant/config"
import { MediaType } from "~/constant/enum"
import { Post, Posts } from "~/types/post.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const postApi = {
  getPosts: (page: number, limit: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return http.get<SuccessResponse<Posts>>(`${config.posts}/?${params.toString()}`)
  },

  getPostDetails: (id: string) => http.get<SuccessResponse<Post>>(`${config.posts}/${id}`),
  createPost: (body: {
    type: number
    audience: number
    content: string | null
    parent_id: string | null
    hashtags?: string[]
    mentions?: string[]
    medias?: {
      type: NonNullable<MediaType | undefined>
      url: string
    }[]
  }) => http.post<SuccessResponse<Post>>(`${config.posts}`, body)
}
