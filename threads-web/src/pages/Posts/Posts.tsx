import React, { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import Button from "~/components/Button"
import HeaderContainer from "~/components/HeaderContainer"
import InfiniteScroll from "~/components/InfiniteScroll"
import Modal, { ModalContent, ModalDescription, ModalHeader, ModalTrigger } from "~/components/Modal/Modal"
import ModalExample from "~/components/Modal/Modal"
import PostCard from "~/components/PostCard"

export const Posts: React.FC = () => {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
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
    <>
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} isLoading={isLoading} className='max-w-2xl mx-auto '>
        <div className='sticky top-0 z-10'>
          <HeaderContainer />
          <button onClick={() => changeLanguage("en")}>English</button>
          <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
        </div>
        <p>{t("hello")}</p>
        <div className='border border-gray-300 bg-white rounded-t-2xl shadow-md'>
          <div className='w-full border-b flex items-center justify-between p-5'>
            <img alt='avatar' src='https://via.placeholder.com/40' className='rounded-full w-10 h-10' />
            <span className='text-left text-sm text-slate-400 w-full mx-2'>Có gì mới ?</span>
            <Button className='border font-semibold text-gray-700 text-base py-2 px-5 rounded-lg'>Đăng</Button>
          </div>
          {items.map((item) => (
            <div key={item} className='p-4 border-b last:border-b-0'>
              <PostCard />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  )
}
