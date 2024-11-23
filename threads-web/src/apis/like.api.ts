import config from "~/constant/config"
import { Like } from "~/types/like.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const bookmarkApi = {
  like: (body: { post_id: string }) => http.post<SuccessResponse<Like>>(config.like, body),
  unlike: (post_id: string) => http.delete<SuccessResponse<Like>>(`${config.unlike}/${post_id}`)
}
