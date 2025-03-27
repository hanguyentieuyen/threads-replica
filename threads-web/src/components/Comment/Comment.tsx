/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import PostAvatar from "../PostAvatar"
import { useToggleState } from "~/hooks/useToggleState"
import { commentApi } from "~/apis/comment.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { AxiosResponse } from "axios"
import { SuccessResponse } from "~/types/utils.type"
import { Comment as CommentType } from "~/types/comment.type"

import Icon from "../Icon"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../Dropdown"
import Button from "../Button"

export default function Comment({
  _id: commentId,
  content,
  username,
  user_avatar,
  like_count: initialLikeCount,
  created_at
}: CommentType) {
  const queryClient = useQueryClient()
  const [currentContent, setCurrentContent] = useState<string>(content)
  const [edit, toggleEdit] = useToggleState(false)
  const [like, toggleLike] = useToggleState(Boolean(initialLikeCount))
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount || 0)

  const updateOptimisticData = (field: "comment_like_count", increment: number) => {
    const cacheKey = [["comment", commentId]]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryClient.setQueryData(cacheKey, (oldData: any) => {
      if (!oldData) {
        // Initialize the data if it's null
        return { [field]: increment }
      }

      return { ...oldData, [field]: (oldData[field] || 0) + increment }
    })
  }

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentApi.delete(commentId),
    onError: () => {
      toast.error("Failed to delete comment.")
    }
  })

  const editCommentMutation = useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentApi.update(commentId, { content }),
    onError: () => {
      toast.error("Failed to update the comment.")
    }
  })

  const likeMutation = useMutation({
    mutationFn: (comment_id: string) => commentApi.like(comment_id),
    onError: () => {
      toast.error("Failed to like the comment.")
    }
  })

  const unlikeMutation = useMutation({
    mutationFn: (comment_id: string) => commentApi.unlike(comment_id),
    onError: () => {
      toast.error("Failed to unlike the comment.")
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMutation = (mutation: any, payload: unknown) => {
    mutation.mutate(payload, {
      onSuccess: (data: AxiosResponse<SuccessResponse<unknown>, unknown>) => toast.success(data.data.message),
      onError: (error: Error) => toast.error(error.message)
    })
  }

  const handleLikeToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    toggleLike()
    if (!like) {
      setLikeCount((prev) => prev + 1)

      updateOptimisticData("comment_like_count", 1)
      handleMutation(likeMutation, commentId)
    } else {
      setLikeCount((prev) => prev - 1)

      updateOptimisticData("comment_like_count", -1)
      handleMutation(unlikeMutation, commentId)
    }
  }

  const handleDeleteComment = (id: string) => {
    deleteCommentMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.data.message)
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const handleEditComment = (id: string) => {
    editCommentMutation.mutate(
      {
        commentId: id,
        content: currentContent
      },
      {
        onSuccess: (data) => {
          toast.success(data.data.message)
          toggleEdit()
        },
        onError: (error) => {
          toast.error(error.message)
        }
      }
    )
  }

  return (
    <div className=' mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <PostAvatar name={username} image={user_avatar || "../src/assets/capy.jpg"} postedTime={created_at} />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Icon name='Ellipsis' size={16} className='cursor-pointer' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => toggleEdit()}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteComment(commentId)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!edit && (
        <>
          <p className='mt-4 text-gray-800 text-left line-clamp-2'>{content}</p>
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
            </div>
          </div>
        </>
      )}
      {edit && (
        <div className='flex items-center space-x-2 p-3 rounded-lg w-full'>
          <input
            autoFocus
            value={currentContent}
            onChange={(e) => setCurrentContent(e.target.value)}
            placeholder='Comment.....'
            className='w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200'
          />
          <Button
            isLoading={editCommentMutation.isPending}
            disabled={editCommentMutation.isPending}
            onClick={() => handleEditComment(commentId)}
            className='flex justify-center bg-gray-950 text-white text-sm p-2 rounded-full'
          >
            <Icon name='SendHorizonal' size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}
