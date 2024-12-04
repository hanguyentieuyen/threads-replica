import { useInfiniteQuery } from "@tanstack/react-query"
import { postApi } from "~/apis/post.api"

const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const limit = 10 // Number of posts per page
  const response = await postApi.getPosts(pageParam, limit)
  return response.data
}

export const useInfinitePosts = () =>
  useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length + 1 : undefined
    }
  })
