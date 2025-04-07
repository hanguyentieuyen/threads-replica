/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { postApi } from "~/apis/post.api"
import ContentContainer from "~/components/ContentContainer"
import HeaderContainer from "~/components/HeaderContainer"
import PostCard from "~/components/PostCard"
import CommentInput from "~/components/CommentInput"
import Comment from "~/components/Comment"
import LoadingScreen from "~/components/LoadingScreen"
import { useInfiniteComments } from "./apis/useInfiniteComments"
import InfiniteScroll from "~/components/InfiniteScroll"
import { Comment as IComment } from "~/types/comment.type"
export const PostDetail: React.FC = () => {
  const { postId } = useParams()

  // Query the post details
  const { data: postDetailsData } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.detail(postId as string)
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteComments(postId as string)

  const comments = data?.pages.flatMap((page) => page.data?.comments) as IComment[]

  const post = postDetailsData?.data.data
  if (!post || !comments) return <LoadingScreen />

  const { _id, bookmark_count, like_count, content, hashtags, mentions, parent_id, created_at } = post
  return (
    <>
      <div className='sticky top-0 z-10'>
        <HeaderContainer />
      </div>
      <div className='fixed top-14 bottom-0 w-full flex items-center justify-center bg-gray-50'>
        <ContentContainer>
          <div className='relative overflow-y-auto h-full pb-20'>
            <InfiniteScroll
              loadMore={fetchNextPage}
              hasMore={hasNextPage || false}
              isLoading={isFetchingNextPage || isLoading}
              className='flex flex-col'
            >
              <div className='p-4 border-b last:border-b-0'>
                <PostCard
                  postId={_id}
                  content={content}
                  hashtags={hashtags}
                  mentions={mentions}
                  parentId={parent_id}
                  bookmarkCount={bookmark_count}
                  likeCount={like_count}
                  username={"username"}
                  createdAt={created_at}
                />
              </div>

              <p className='text-left p-4 font-bold'>Thread trả lời</p>
              <hr />

              {comments.map((item, idx) => (
                <div key={idx} className='p-4 border-b last:border-t-0'>
                  <Comment
                    _id={item._id}
                    content={item.content}
                    like_count={item.like_count}
                    user_avatar={item.user_avatar}
                    username={item.username}
                    created_at={item.created_at}
                  />
                </div>
              ))}
            </InfiniteScroll>

            <div className='absolute bottom-0 left-0 right-0 flex justify-center'>
              <CommentInput postId={_id} parentCommentId={null} />
            </div>
          </div>
        </ContentContainer>
      </div>
    </>
  )
}
