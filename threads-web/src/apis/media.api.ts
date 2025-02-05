import config from "~/constant/config"
import { Media } from "~/types/media.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const mediaApi = {
  uploadImage: (file: File) => {
    const form = new FormData()
    form.append("image", file)

    return http.post<SuccessResponse<Media>>(`${config.uploadImage}`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  },

  uploadVideo: (file: File) => {
    const form = new FormData()
    form.append("video", file)

    return http.post<SuccessResponse<Media>>(`${config.uploadVideo}`, form, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
  }
}
