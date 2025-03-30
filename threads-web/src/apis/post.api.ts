/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { apiEndpoints } from "~/constant/config"
import { MediaType } from "~/constant/enum"
import { Post, Posts } from "~/types/post.type"
import { PostBookmark } from "~/types/postBookmark.type"
import { PostLike } from "~/types/postLike.type"

import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const postApi = {
  get: (page: number, limit: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    return axiosInstance.get<SuccessResponse<Posts>>(apiEndpoints.post.get, { params })
  },

  detail: (id: string) => axiosInstance.get<SuccessResponse<Post>>(apiEndpoints.post.detail(id)),

  create: (body: {
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
  }) => axiosInstance.post<SuccessResponse<Post>>(apiEndpoints.post.create, body),

  like: (post_id: string) => axiosInstance.post<SuccessResponse<PostLike>>(apiEndpoints.post.like(post_id)),
  unlike: (post_id: string) => axiosInstance.delete<SuccessResponse<PostLike>>(apiEndpoints.post.unlike(post_id)),

  bookmark: (post_id: string) => axiosInstance.post<SuccessResponse<PostBookmark>>(apiEndpoints.post.bookmark(post_id)),
  unbookmark: (post_id: string) =>
    axiosInstance.delete<SuccessResponse<PostBookmark>>(apiEndpoints.post.unbookmark(post_id))
}
