import config from "~/constant/config"
import { Media } from "~/types/media.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const mediaApi = {
  uploadImage: (formData: FormData) => {
    return http.post<SuccessResponse<Media>>(`${config.uploadImage}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  uploadVideo: (formData: FormData) => {
    return http.post<SuccessResponse<Media>>(`${config.uploadVideo}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}
