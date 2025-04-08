/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Router } from 'express'
import {
  bookmarkPostController,
  createPostController,
  getPostChildrenController,
  getPostController,
  getPostsController,
  likePostController,
  unbookmarkPostController,
  unlikePostController
} from '~/controllers/posts.controllers'
import {
  createPostValidator,
  getPostChildrenValidator,
  paginationValidator,
  postIdValidator,
  postValidator
} from '~/validations/posts.validations'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { getCommentsController } from '~/controllers/comments.controllers'
import { accessTokenValidator } from '~/validations/auth.validations'

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
 * Description: Get comments and child comments
 * Path: /:post_id/comments
 * Method: GET
 * Param: post_id: string
 * Header: { Authorization: Bearer <access_token>}
 */

postsRouter.get(
  '/:post_id/comments',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postValidator, 'params'),
  requestHandler(getCommentsController)
)

/**
 * Description: Like a Post
 * Path: /:post_id/like
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 */

postsRouter.post(
  '/:post_id/like',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postIdValidator, 'params'),
  requestHandler(likePostController)
)

/**
 * Description: Unlike Post
 * Path: /:post_id/like
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

postsRouter.delete(
  '/:post_id/like',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postIdValidator, 'params'),
  requestHandler(unlikePostController)
)

/**
 * Description: Bookmark post
 * Path: /:post_id/bookmark
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

postsRouter.post(
  '/:post_id/bookmark',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postIdValidator, 'params'),
  requestHandler(bookmarkPostController)
)

/**
 * Description: Unbookmark post
 * Path: /:post_id/bookmark
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

postsRouter.delete(
  '/:post_id/bookmark',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(postIdValidator, 'params'),
  requestHandler(unbookmarkPostController)
)
export default postsRouter
