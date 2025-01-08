import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { postApi } from "~/apis/post.api"
import Button from "~/components/Button"
import ContentContainer from "~/components/ContentContainer"
import HeaderContainer from "~/components/HeaderContainer"
import PostCard from "~/components/PostCard"

export const PostDetail: React.FC = () => {
  const { postId } = useParams()

  // Query the post details
  const { data: postDetailsData } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.getPostDetails(postId as string)
  })

  const post = postDetailsData?.data.data
  if (!post) return null

  const { bookmark_count, like_count, content, hashtags, mentions, parent_id, created_at } = post
  return (
    <>
      <div className='sticky top-0 z-10'>
        <HeaderContainer />
      </div>
      <ContentContainer>
        <div className='w-full border-b flex items-center justify-between p-5'>
          <img alt='avatar' src='https://via.placeholder.com/40' className='rounded-full w-10 h-10' />
          <span className='text-left text-sm text-slate-400 w-full mx-2'>Có gì mới ?</span>
          <Button className='border font-semibold text-gray-700 text-base py-2 px-5 rounded-lg'>Đăng</Button>
        </div>
        <div className='p-4 border-b last:border-b-0'>
          <PostCard
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
      </ContentContainer>
    </>
  )
}
