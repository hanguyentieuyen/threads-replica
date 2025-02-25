import apiEndpoints from "~/constant/config"
import { SuccessResponse } from "~/types/utils.type"
import { CommentLike, Comments, NewComment } from "~/types/comment.type"
import axiosInstance from "~/utils/axios"

export const commentApi = {
  get: ({ post_id, page, limit }: { post_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    return axiosInstance.get<SuccessResponse<Comments>>(apiEndpoints.comment.get(post_id), { params })
  },
  create: (body: { content: string; parent_id: string | null; post_id: string }) =>
    axiosInstance.post<SuccessResponse<NewComment>>(apiEndpoints.comment.create, body),

  like: (comment_id: string) => axiosInstance.post<SuccessResponse<CommentLike>>(apiEndpoints.comment.like(comment_id)),
  unlike: (comment_id: string) =>
    axiosInstance.delete<SuccessResponse<CommentLike>>(apiEndpoints.comment.unlike(comment_id))
}
