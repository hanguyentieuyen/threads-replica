import { Router } from 'express'
import { createCommentController } from '~/controllers/posts.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { createCommentValidator } from '~/validations/comment.validations'
import { accessTokenValidator } from '~/validations/users.validations'

const commentsRouter = Router()

/**
 * Description: create a new comment
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { parent_id: string, content_id: string, post_id: string}
 */
commentsRouter.post(
  '/',
  validateMiddleware(createCommentValidator, 'body'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(createCommentController)
)

export default commentsRouter
