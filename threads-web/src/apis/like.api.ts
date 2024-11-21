import config from "~/constant/config"
import { Like } from "~/types/like.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const bookmarkApi = {
  bookmark: (body: { post_id: string }) => http.post<SuccessResponse<Like>>(config.like, body),
  unBookmark: (id: string) => http.delete<SuccessResponse<Like>>(`${config.unLike}/${id}`)
}
