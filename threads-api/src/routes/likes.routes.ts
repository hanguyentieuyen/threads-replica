import { Router } from 'express'
import { likesController, unlikesController } from '~/controllers/likes.controllers'
import { likeValidator, unlikeValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'

const likeRouter = Router()

/**
 * Description: Like Post
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

likeRouter.post(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(likeValidator, 'body'),
  requestHandler(likesController)
)

/**
 * Description: Unlike Post
 * Path: /post/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

likeRouter.delete(
  '/post/:post_id',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(unlikeValidator, 'body'),
  requestHandler(unlikesController)
)
export default likeRouter
