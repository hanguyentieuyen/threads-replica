import { useInfiniteQuery } from "@tanstack/react-query"
import { postApi } from "~/apis/post.api"

const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const limit = 2 // Number of posts per page
  const response = await postApi.get(pageParam, limit)
  return response.data
}

export const useInfinitePosts = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => {
      if (lastPage.data) {
        return lastPage.data?.page < lastPage.data?.total_page ? lastPage.data?.page + 1 : undefined
      }
    }
  })
