/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useInfiniteQuery } from "@tanstack/react-query"
import { userApi } from "~/apis/user.api"
import FollowerCard from "~/components/FollowerCard"
import InfiniteScroll from "~/components/InfiniteScroll"

const userId = "6713e74880a37c56378c90eb"
export const UserFollowerList = () => {
  const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const limit = 2 // Number of posts per page
    const response = await userApi.getUserFollowers({ user_id: userId, page: pageParam, limit })
    return response.data
  }

  const useInfiniteUserFollowers = () =>
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["userFollowers"],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => {
        if (lastPage.data) {
          return lastPage.data?.page < lastPage.data?.total_page ? lastPage.data?.page + 1 : undefined
        }
      }
    })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteUserFollowers()
  const userFollowers = data?.pages.flatMap((page) => page.data?.user_followers)
  if (!userFollowers || userFollowers.length <= 0) return []

  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage || false} isLoading={isFetchingNextPage || isLoading}>
      {userFollowers?.map((item) => (
        <div className='my-4' key={item?.id}>
          <FollowerCard username={item?.username} profileImage={item?.avatar || ""} fullName={item?.name} />
        </div>
      ))}
    </InfiniteScroll>
  )
}
