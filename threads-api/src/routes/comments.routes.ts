import { Router } from 'express'
import {
  createCommentController,
  likeCommentController,
  unlikeCommentController
} from '~/controllers/comments.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { commentIdValidator, createCommentValidator } from '~/validations/comment.validations'
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

/**
 * Description: like a comment
 * Path: /:comment_id/like
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Path paramenter: comment_id
 */
commentsRouter.post(
  '/:comment_id/like',
  validateMiddleware(commentIdValidator, 'params'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(likeCommentController)
)

/**
 * Description: unlike a comment
 * Path: /:comment_id/like
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 * Path paramenter: comment_id
 */
commentsRouter.delete(
  '/:comment_id/like',
  validateMiddleware(commentIdValidator, 'params'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(unlikeCommentController)
)
export default commentsRouter
