import React from "react"
import { useInfiniteScroll } from "~/hooks/useInfiniteScroll"
import ScrollContainer from "../ScrollContainer"
import { Loader2 } from "lucide-react"

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
            <Loader2 className='animate-spin' />
          </div>
        </div>
      )}
    </ScrollContainer>
  )
}
