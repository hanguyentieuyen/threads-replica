import apiEndpoints from "~/constant/config"
import { MediaType } from "~/constant/enum"
import { Post, Posts } from "~/types/post.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const postApi = {
  getPosts: (page: number, limit: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<Posts>>(`${apiEndpoints.posts}/?${params.toString()}`)
  },

  getPostDetails: (id: string) => axiosInstance.get<SuccessResponse<Post>>(`${apiEndpoints.posts}/${id}`),
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
  }) => axiosInstance.post<SuccessResponse<Post>>(`${apiEndpoints.posts}`, body)
}
