import { useEffect, useRef, useState } from "react"

export const useInfiniteScroll = (loadMore: () => void, hasMore: boolean) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isIntersecting && hasMore) {
      loadMore()
    }
  }, [isIntersecting, loadMore, hasMore])

  useEffect(() => {
    const currentTriggerRef = loadMoreTriggerRef.current
    const observer = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting), { threshold: 0.1 })

    if (currentTriggerRef) {
      observer.observe(currentTriggerRef)
    }

    observerRef.current = observer

    return () => {
      if (currentTriggerRef) {
        observer.unobserve(currentTriggerRef)
      }
      observer.disconnect()
    }
  }, [loadMoreTriggerRef])

  return { loadMoreTriggerRef }
}
