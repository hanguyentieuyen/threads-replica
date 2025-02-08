import apiEndpoints from "~/constant/config"
import { Bookmark } from "~/types/bookmark.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const bookmarkApi = {
  bookmark: (body: { post_id: string }) => axiosInstance.post<SuccessResponse<Bookmark>>(apiEndpoints.bookmark, body),
  unbookmark: (post_id: string) =>
    axiosInstance.delete<SuccessResponse<Bookmark>>(`${apiEndpoints.unbookmark}/${post_id}`)
}
