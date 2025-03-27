/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import React from "react"
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll"
import ScrollContainer from "../ScrollContainer"
import Icon from "../Icon"

interface InfiniteScrollProps {
  children: React.ReactNode
  loadMore: () => void
  hasMore: boolean
  isLoading: boolean
  className?: string
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  loadMore,
  hasMore,
  isLoading,
  className = ""
}) => {
  const { loadMoreTriggerRef } = useInfiniteScroll(loadMore, hasMore)

  return (
    <ScrollContainer className={`h-full ${className}`}>
      {children}
      {(hasMore || isLoading) && (
        <div ref={loadMoreTriggerRef}>
          <div className='flex justify-center items-center p-4'>
            <Icon name='Loader2' className='animate-spin' />
          </div>
        </div>
      )}
    </ScrollContainer>
  )
}
