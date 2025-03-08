import apiEndpoints from "~/constant/config"
import { SuccessResponse } from "~/types/utils.type"
import { CommentLike, Comments, NewComment as Comment } from "~/types/comment.type"
import axiosInstance from "~/utils/axios"

export const commentApi = {
  get: ({ post_id, page, limit }: { post_id: string; page: number; limit: number }) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    return axiosInstance.get<SuccessResponse<Comments>>(apiEndpoints.comment.get(post_id), { params })
  },
  create: (body: { content: string; parent_id: string | null; post_id: string }) =>
    axiosInstance.post<SuccessResponse<Comment>>(apiEndpoints.comment.create, body),

  update: (comment_id: string, body: { content: string }) =>
    axiosInstance.put<SuccessResponse<Comment>>(apiEndpoints.comment.update(comment_id), body),

  delete: (comment_id: string) =>
    axiosInstance.delete<SuccessResponse<string>>(apiEndpoints.comment.delete(comment_id)),

  like: (comment_id: string) => axiosInstance.post<SuccessResponse<CommentLike>>(apiEndpoints.comment.like(comment_id)),

  unlike: (comment_id: string) =>
    axiosInstance.delete<SuccessResponse<CommentLike>>(apiEndpoints.comment.unlike(comment_id))
}
