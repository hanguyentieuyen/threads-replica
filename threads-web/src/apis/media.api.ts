import apiEndpoints from "~/constant/config"
import { Media } from "~/types/media.type"
import { SuccessResponse } from "~/types/utils.type"
import axiosInstance from "~/utils/axios"

export const mediaApi = {
  uploadImage: (file: File) => {
    const form = new FormData()
    form.append("image", file)

    return axiosInstance.post<SuccessResponse<Media>>(`${apiEndpoints.uploadImage}`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  uploadVideo: (file: File) => {
    const form = new FormData()
    form.append("video", file)

    return axiosInstance.post<SuccessResponse<Media>>(`${apiEndpoints.uploadVideo}`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}
