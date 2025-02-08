import apiEndpoints from "~/constant/config"
import { Like } from "~/types/like.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const likeApi = {
  like: (body: { post_id: string }) => axiosInstance.post<SuccessResponse<Like>>(apiEndpoints.like, body),
  unlike: (post_id: string) => axiosInstance.delete<SuccessResponse<Like>>(`${apiEndpoints.unlike}/${post_id}`)
}
