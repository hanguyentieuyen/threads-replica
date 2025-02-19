import { Request, Response } from 'express'
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
