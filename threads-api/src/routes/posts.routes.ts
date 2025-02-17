import { Router } from 'express'
import {
  createCommentController,
  createPostController,
  getPostChildrenController,
  getPostController,
  getPostsController
} from '~/controllers/posts.controllers'
import {
  createCommentValidator,
  createPostValidator,
  getPostChildrenValidator,
  paginationValidator,
  postValidator
} from '~/validations/posts.validations'
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
 * Description: Get a detail post
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
 * Params: {limit: number, page: number}
 */
postsRouter.get(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(paginationValidator, 'params'),
  requestHandler(getPostsController)
)

/**
 * Description: get post children
 * Path: /:post_id/children
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 * Query: {limit: number, page: number, post_type: PostType}
 */
postsRouter.get(
  '/:post_id/children',
  validateMiddleware(postValidator, 'params'),
  validateMiddleware(paginationValidator, 'params'),
  validateMiddleware(getPostChildrenValidator, 'params'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(getPostChildrenController)
)

/**
 * Description: create a new comment
 * Path: /:post_id/comments
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Query: { parent_id: string, content_id: string}
 */
postsRouter.post(
  '/:post_id/comments',
  validateMiddleware(postValidator, 'params'),
  validateMiddleware(createCommentValidator, 'body'),
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(createCommentController)
)
export default postsRouter
