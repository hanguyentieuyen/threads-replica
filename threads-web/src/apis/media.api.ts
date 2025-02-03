import config from "~/constant/config"
import { Media } from "~/types/media.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const mediaApi = {
  uploadImage: (file: File) => {
    return http.post<SuccessResponse<Media>>(`${config.uploadImage}`, file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },
  uploadVideo: (file: File) => {
    return http.post<SuccessResponse<Media>>(`${config.uploadVideo}`, file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}
