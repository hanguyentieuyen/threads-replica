/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useInfiniteQuery } from "@tanstack/react-query"
import { userApi } from "~/apis/user.api"
import Button from "~/components/Button"
import ContentContainer from "~/components/ContentContainer"
import FollowerCard from "~/components/FollowerCard"
import InputText from "~/components/InputText"
import InfiniteScroll from "~/components/InfiniteScroll"

export default function Search() {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState("")
  const searchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const limit = 5
    const response = await userApi.searchUsers({ query: searchText, page: pageParam, limit })
    return response.data
  }

  const useInfiniteSearchUsers = () =>
    useInfiniteQuery({
      initialPageParam: 1,
      queryKey: ["search_users"],
      queryFn: searchUsers,
      getNextPageParam: (lastPage) => {
        if (lastPage.data) {
          return lastPage.data?.page < lastPage.data?.total_page ? lastPage.data?.page + 1 : undefined
        }
      }
    })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteSearchUsers()
  const users = data?.pages.flatMap((page) => page.data?.users)
  if (!users || users.length <= 0) return []

  return (
    <div>
      <div className='sticky top-0 z-10'>
        <Button className='min-w-28 font-semibold text-gray-700 text-sm h-16'>{t("search")}</Button>
      </div>
      <ContentContainer>
        <div className='p-4'>
          <InputText
            placeholder='Search'
            name='searchText'
            className='my-3 text-sm'
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <p className='w-full text-slate-400 text-sm font-semibold text-left pl-4'>{t("suggestedFollowUp")}</p>
        <InfiniteScroll
          loadMore={fetchNextPage}
          hasMore={hasNextPage || false}
          isLoading={isFetchingNextPage || isLoading}
        >
          {users.map((item) => (
            <div key={item?._id} className='p-4 border-b last:border-b-0'>
              <FollowerCard
                username={item?.username}
                fullName={item?.name}
                profileImage='../src/assets/capela.jpg'
                followersCount={34}
                isVerified
              />
            </div>
          ))}
        </InfiniteScroll>
      </ContentContainer>
    </div>
  )
}
