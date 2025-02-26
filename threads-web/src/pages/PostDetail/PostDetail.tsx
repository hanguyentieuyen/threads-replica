import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { commentApi } from "~/apis/comment.api"
import { postApi } from "~/apis/post.api"
import ContentContainer from "~/components/ContentContainer"
import HeaderContainer from "~/components/HeaderContainer"
import PostCard from "~/components/PostCard"
import Comment from "~/components/Comment"
export const PostDetail: React.FC = () => {
  const { postId } = useParams()

  // Query the post details
  const { data: postDetailsData } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => postApi.detail(postId as string)
  })

  // Query the comments of post
  const { data: commentsData } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentApi.get({ post_id: postId as string, page: 1, limit: 20 })
  })

  const post = postDetailsData?.data.data
  if (!post) return null
  const comments = commentsData?.data
  console.log(comments)

  const { _id, bookmark_count, like_count, content, hashtags, mentions, parent_id, created_at } = post
  return (
    <>
      <div className='sticky top-0 z-10'>
        <HeaderContainer />
      </div>
      <ContentContainer>
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
        <div>
          <Comment postId={_id} parentCommentId={null} />
        </div>
      </ContentContainer>
    </>
  )
}
