import { useMutation } from "@tanstack/react-query"
import Button from "../Button"
import Icon from "../Icon"
import Textarea from "../Textarea"
import { commentApi } from "~/apis/comment.api"
import { useState } from "react"
import { toast } from "react-toastify"

type CommentProps = {
  className?: string
  postId: string
  parentCommentId: string | null
}

type CommentDataType = {
  parent_id: string | null
  post_id: string
  content: string
}
export default function CommentInput({ className, postId, parentCommentId }: CommentProps) {
  const [content, setContent] = useState<string>("")
  const createCommentMutation = useMutation({
    mutationFn: (body: CommentDataType) => commentApi.create(body)
  })
  const handleCreateComment = () => {
    const commentData = {
      content,
      parent_id: parentCommentId || null,
      post_id: postId
    }
    createCommentMutation.mutate(commentData, {
      onSuccess: (data) => {
        setContent("")
        toast.success(data.data.message, { autoClose: 3000 })
        //createCommentMutation.reset()
      },
      onError: () => {
        console.error("Error creating comment")
      }
    })
  }

  return (
    <div className='flex items-center space-x-2 p-3 bg-gray-100 rounded-lg w-full'>
      <img src='../src/assets/capy.jpg' alt='User Avatar' className='w-8 h-8 rounded-full' />
      <Textarea
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Trả lời catalinmpit...'
        className='w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-200'
      />
      <Button
        isLoading={createCommentMutation.isPending}
        disabled={createCommentMutation.isPending}
        onClick={handleCreateComment}
        className='flex justify-center bg-gray-950 text-white text-sm p-2 rounded-full'
      >
        <Icon name='SendHorizonal' size={16} />
      </Button>
    </div>
  )
}
