import { Router } from 'express'
import { createPostController, getPostController, getPostsController } from '~/controllers/posts.controllers'
import { createPostValidator, paginationValidator, postValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'

const postsRouter = Router()

/**
 * Description: Create a new post
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: PostRequestBody
 */
postsRouter.post(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(createPostValidator, 'body'),
  requestHandler(createPostController)
)

/**
 * Description: Get a  post
 * Path: /:post_id
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 */
postsRouter.get(
  '/:post_id',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postValidator, 'params'),
  requestHandler(getPostController)
)

/**
 * Description: Get new posts
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 * Query: {limit: number, page: number}
 */
postsRouter.get(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(paginationValidator, 'params'),
  requestHandler(getPostsController)
)
export default postsRouter
