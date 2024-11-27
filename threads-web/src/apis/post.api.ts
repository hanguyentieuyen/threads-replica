import config from "~/constant/config"
import { Post } from "~/types/post.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const postApi = {
  getPosts: (page: number, limit: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return http.get<SuccessResponse<Post[]>>(`${config.posts}/?${params.toString()}`)
  },

  getPostDetails: (id: string) => http.get<SuccessResponse<Post>>(`${config.posts}/${id}`)
}
