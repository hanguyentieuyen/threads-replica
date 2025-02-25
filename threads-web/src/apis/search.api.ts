import apiEndpoints from "~/constant/config"
import { Post } from "~/types/post.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const searchApi = {
  search: (content: string, limit: number, page: number = 1) => {
    const params = new URLSearchParams({
      content,
      limit: limit.toString(),
      page: page.toString()
    })

    return axiosInstance.get<SuccessResponse<Post>>(apiEndpoints.search.searchPost, {
      params: params
    })
  }
}
