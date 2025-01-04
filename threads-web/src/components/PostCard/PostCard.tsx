import PostAvatar from "../PostAvatar"
import { useToggleState } from "~/hooks/useToggleState"
import { likeApi } from "~/apis/like.api"
import { bookmarkApi } from "~/apis/bookmark.api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { AxiosResponse } from "axios"
import { SuccessResponse } from "~/types/utils.type"
import Icon from "../Icon"

type PostCardProps = {
  postId: string
  content: string
  hashtags: string[]
  mentions: string[]
  parentId: string | null
  username: string
  bookmarkCount: number
  likeCount: number
  createdAt?: string
}
// Test with post_id
//const post_id = "66d6059974ecbef1214d20ab"
export default function PostCard({
  postId,
  content,
  hashtags,
  mentions,
  parentId,
  username,
  bookmarkCount,
  likeCount,
  createdAt
}: PostCardProps) {
  const [like, toggleLike] = useToggleState(false)
  const [bookmark, toggleBookmark] = useToggleState(false)

  const likeMutation = useMutation({
    mutationFn: (body: { post_id: string }) => likeApi.like(body)
  })

  const unlikeMutation = useMutation({
    mutationFn: (post_id: string) => likeApi.unlike(post_id)
  })

  const bookmarkMutation = useMutation({
    mutationFn: (body: { post_id: string }) => bookmarkApi.bookmark(body)
  })

  const unbookmarkMutation = useMutation({
    mutationFn: (post_id: string) => bookmarkApi.unbookmark(post_id)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMutation = (mutation: any, payload: unknown) => {
    mutation.mutate(payload, {
      onSuccess: (data: AxiosResponse<SuccessResponse<unknown>, unknown>) => toast.success(data.data.message),
      onError: (error: Error) => toast.error(error.message)
    })
  }

  const handleLikeToggle = () => {
    toggleLike()
    if (!like) {
      handleMutation(likeMutation, { post_id: postId })
    } else {
      handleMutation(unlikeMutation, postId)
    }
  }

  const handleBookmarkToggle = () => {
    toggleBookmark()
    if (!bookmark) {
      handleMutation(bookmarkMutation, { post_id: postId })
    } else {
      handleMutation(unbookmarkMutation, postId)
    }
  }

  return (
    <div className=' mx-auto'>
      {/* Header */}
      <div className='flex items-center'>
        <PostAvatar name={username} image='../src/assets/capy.jpg' postedTime='10 hours ago' />
      </div>

      {/* Content */}
      <p className='mt-4 text-gray-800 text-left line-clamp-2'>{content}</p>
      <div className='flex space-x-2 mt-2'>
        {/* <img src='https://via.placeholder.com/150' alt='Post Image 1' className='w-1/2 rounded-lg' />
        <img src='https://via.placeholder.com/150' alt='Post Image 2' className='w-1/2 rounded-lg' /> */}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between mt-4 text-gray-500'>
        <div className='flex space-x-4'>
          <div
            className='flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-slate-100 cursor-pointer'
            onClick={handleLikeToggle}
          >
            <Icon name='Heart' strokeWidth={2} size={16} color={like ? "red" : undefined} />
            <span>{likeCount}</span>
          </div>
          <div className='flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-slate-100'>
            <Icon name='MessageCircle' strokeWidth={2} size={16} />
            <span>5</span>
          </div>
          <div className='flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-slate-100'>
            <Icon name='Repeat2' strokeWidth={1} />
            <span>42</span>
          </div>
          <div
            className='flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-slate-100 cursor-pointer'
            onClick={handleBookmarkToggle}
          >
            <Icon name='Bookmark' strokeWidth={2} size={16} color={bookmark ? "#eab308" : undefined} />
            <span>{bookmarkCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
