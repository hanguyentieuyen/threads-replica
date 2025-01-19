import { useInfiniteQuery } from "@tanstack/react-query"
import { userApi } from "~/apis/user.api"
import FollowerCard from "~/components/FollowerCard"
import InfiniteScroll from "~/components/InfiniteScroll"

const userId = "6713e74880a37c56378c90eb"

export const UserFollowingList = () => {
  const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const limit = 2 // Number of posts per page
    const response = await userApi.getUserFollowing({ user_id: userId, page: pageParam, limit })
    return response.data
  }

  const useInfiniteUserFollowings = () =>
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["userFollowings"],
      queryFn: fetchPosts,
      getNextPageParam: (lastPage) => {
        if (lastPage.data) {
          return lastPage.data?.page < lastPage.data?.total_page ? lastPage.data?.page + 1 : undefined
        }
      }
    })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteUserFollowings()
  const userFollowings = data?.pages.flatMap((page) => page.data?.user_following)
  if (!userFollowings || userFollowings.length <= 0) return []

  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage || false} isLoading={isFetchingNextPage || isLoading}>
      {userFollowings?.map((item) => (
        <div className='my-4' key={item?.id}>
          <FollowerCard username={item?.username} profileImage={item?.avatar || ""} fullName={item?.name} />
        </div>
      ))}
    </InfiniteScroll>
  )
}
