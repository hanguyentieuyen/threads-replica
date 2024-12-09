import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import Button from "~/components/Button"
import HeaderContainer from "~/components/HeaderContainer"
import InfiniteScroll from "~/components/InfiniteScroll"
import { Modal, ModalContent, ModalTrigger } from "~/components/Modal/Modal"
import PostCard from "~/components/PostCard"
import path from "~/constant/path"
import NewPostForm from "./components/NewPostForm"
import { useInfinitePosts } from "./apis/useInfinitePosts"

export const Posts: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfinitePosts()
  //const posts = data?.pages.flatMap((page) => page.data) || []
  const posts = data?.pages[0].data?.posts || []
  console.log("posts: ", posts)
  return (
    <>
      <InfiniteScroll
        loadMore={fetchNextPage}
        hasMore={hasNextPage || false}
        isLoading={isFetchingNextPage || isLoading}
        className='max-w-2xl mx-auto'
      >
        <div className='sticky top-0 z-10'>
          <HeaderContainer />
          <button onClick={() => changeLanguage("en")}>English</button>
          <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
        </div>
        <p>{t("hello")}</p>
        <div className='border border-gray-300 bg-white rounded-t-2xl shadow-md'>
          <div className='w-full border-b flex items-center justify-between p-5'>
            <img
              onClick={() => navigate(path.me)}
              alt='avatar'
              src='https://via.placeholder.com/40'
              className='rounded-full w-10 h-10 cursor-pointer'
            />
            <Modal>
              <ModalTrigger>
                <div className='w-full flex items-center justify-between'>
                  <span className='text-left text-sm text-slate-400 w-full mx-2 cursor-text'>Có gì mới ?</span>
                  <Button className='border font-semibold text-gray-700 text-base py-2 px-5 rounded-lg'>Đăng</Button>
                </div>
              </ModalTrigger>
              <ModalContent>
                <NewPostForm />
              </ModalContent>
            </Modal>
          </div>
          {posts.map((item) => (
            <div key={item?._id} className='p-4 border-b last:border-b-0'>
              <PostCard />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  )
}
