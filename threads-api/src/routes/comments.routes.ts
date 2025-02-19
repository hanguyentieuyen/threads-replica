import { Router } from 'express'
import { getCommentsController } from '~/controllers/comments.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { postValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/users.validations'

const commentsRouter = Router()

/**
 * Description: Get comments and child comments
 * Path: /
 * Method: GET
 * Param: post_id: string
 * Header: { Authorization: Bearer <access_token>}
 */

commentsRouter.get(
  '/:post_id/replies',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postValidator, 'params'),
  requestHandler(getCommentsController)
)

export default commentsRouter
