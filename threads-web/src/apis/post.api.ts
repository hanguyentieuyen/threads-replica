import config from "~/constant/config"
import { Post } from "~/types/post.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const postApi = {
  getPosts: () => http.get<SuccessResponse<Post[]>>(config.posts),
  getPostDetails: (id: string) => http.get<SuccessResponse<Post>>(`${config.posts}/${id}`)
}
