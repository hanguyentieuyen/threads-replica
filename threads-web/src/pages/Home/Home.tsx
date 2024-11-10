import React, { useState, useCallback } from "react"
import InfiniteScroll from "~/components/InfiniteScroll"

export const Home: React.FC = () => {
  const [items, setItems] = useState<number[]>(Array.from({ length: 20 }, (_, i) => i + 1))
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(() => {
    setIsLoading(true)
    // Simulating an API call
    setTimeout(() => {
      const newItems = Array.from({ length: 20 }, (_, i) => items.length + i + 1)
      setItems((prevItems) => [...prevItems, ...newItems])
      setIsLoading(false)
      if (items.length + newItems.length >= 100) {
        setHasMore(false)
      }
    }, 1000)
  }, [items])

  return (
    <div className='h-screen p-4 bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Infinite Scroll Example</h1>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        className='h-[calc(100vh-100px)] bg-white rounded-lg shadow-md'
      >
        {items.map((item) => (
          <div key={item} className='p-4 border-b last:border-b-0'>
            Item {item}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}
