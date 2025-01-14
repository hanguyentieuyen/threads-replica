import config from "~/constant/config"
import { Bookmark } from "~/types/bookmark.type"
import { SuccessResponse } from "~/types/utils.type"
import http from "~/utils/http"

export const bookmarkApi = {
  bookmark: (body: { post_id: string }) => http.post<SuccessResponse<Bookmark>>(config.bookmark, body),
  unbookmark: (post_id: string) => http.delete<SuccessResponse<Bookmark>>(`${config.unbookmark}/${post_id}`)
}
