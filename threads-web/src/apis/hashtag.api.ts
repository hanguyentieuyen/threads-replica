/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import apiEndpoints from "~/constant/config"
import { Hashtag } from "~/types/hashtag.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const hashtagApi = {
  search: (search: string) => {
    const params = new URLSearchParams({ search: search })
    return axiosInstance.get<SuccessResponse<Hashtag[]>>(apiEndpoints.hashtag.search, { params })
  },
  create: (body: { hashtag: string }) => axiosInstance.post<SuccessResponse<Hashtag>>(apiEndpoints.hashtag.create, body)
}
