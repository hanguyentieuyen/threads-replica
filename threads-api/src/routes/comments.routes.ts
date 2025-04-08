/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Router } from 'express'
import {
  createCommentController,
  deleteCommentController,
  likeCommentController,
  unlikeCommentController,
  updateCommentController
} from '~/controllers/comments.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { accessTokenValidator } from '~/validations/auth.validations'
import { commentIdValidator, createCommentValidator, updateCommentValidator } from '~/validations/comment.validations'

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
 * Description: update comment
 * Path: /:comment_id
 * Method: PUT
 * Header: { Authorization: Bearer <access_token>}
 */
commentsRouter.put(
  '/:comment_id',
  validateMiddleware(commentIdValidator, 'params'),
  validateMiddleware(updateCommentValidator, 'body'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(updateCommentController)
)

/**
 * Description: delete comment
 * Path: /:comment_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */
commentsRouter.delete(
  '/:comment_id',
  validateMiddleware(commentIdValidator, 'params'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(deleteCommentController)
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
