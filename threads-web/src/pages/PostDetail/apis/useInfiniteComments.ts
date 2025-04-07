/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useInfiniteQuery } from "@tanstack/react-query"
import { commentApi } from "~/apis/comment.api"

const fetchComments = async ({ pageParam = 1, queryKey }: { pageParam?: number; queryKey: string[] }) => {
  const [, postId] = queryKey
  const limit = 2 // Number of comments per page
  const response = await commentApi.get({ post_id: postId, page: pageParam, limit })
  return response.data
}

export const useInfiniteComments = (postId: string) =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["comments", postId],
    queryFn: fetchComments,
    getNextPageParam: (lastPage) => {
      if (lastPage.data) {
        return lastPage.data?.page < lastPage.data?.total_page ? lastPage.data?.page + 1 : undefined
      }
    }
  })
