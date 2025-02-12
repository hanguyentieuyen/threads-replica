import apiEndpoints from "~/constant/config"
import { Hashtag } from "~/types/hashtag.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const hashtagApi = {
  searchHashtags: (search: string) => {
    const params = new URLSearchParams({ search: search })
    return axiosInstance.get<SuccessResponse<Hashtag[]>>(`${apiEndpoints.hashtags}/?${params}`)
  },
  createHashtag: (body: { hashtag: string }) =>
    axiosInstance.post<SuccessResponse<Hashtag>>(`${apiEndpoints.hashtags}`, body)
}
