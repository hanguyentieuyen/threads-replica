import config from "~/constant/config"
import { Post } from "~/types/post.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const searchApi = {
  search: (content: string, limit: number, page: number = 1) => {
    const params = new URLSearchParams({
      content,
      limit: limit.toString(),
      page: page.toString()
    })

    return http.get<SuccessResponse<Post>>(`${config.search}/?${params.toString()}`)
  }
}
