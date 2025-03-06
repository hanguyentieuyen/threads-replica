import { Request, Response } from 'express'
import { POSTS_MESSAGES } from '~/constants/messages'
import { TokenPayload } from '~/models/requestType/User.requests'
import commentsService from '~/services/comments.services'

export const getCommentsController = async (req: Request, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const { post_id } = req.validateData
  const data = await commentsService.getComments({ post_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      comments: data.comments
    }
  })
}

export const createCommentController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { post_id, parent_id, content } = req.validateData

  const data = await commentsService.createComment({
    user_id,
    post_id,
    body: {
      parent_id,
      content
    }
  })
  return res.json({
    message: POSTS_MESSAGES.CREATE_COMMENT_SUCCESS,
    data
  })
}

export const updateCommentController = async (req: Request, res: Response) => {
  const { comment_id, content } = req.validateData

  const data = await commentsService.updateComment({ id: comment_id, content })
  return res.json({
    data
  })
}

export const deleteCommentController = async (req: Request, res: Response) => {
  const { comment_id } = req.validateData
  const data = await commentsService.deleteComment({ id: comment_id })
  return res.json({
    data
  })
}

export const likeCommentController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { comment_id } = req.validateData
  const data = await commentsService.likeComment({ user_id, comment_id })
  return res.json({
    data
  })
}

export const unlikeCommentController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { comment_id } = req.validateData
  const data = await commentsService.unlikeComment({ user_id, comment_id })
  return res.json({
    data
  })
}
