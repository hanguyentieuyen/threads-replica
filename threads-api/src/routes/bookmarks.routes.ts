import { Router } from 'express'
import { bookmarksController, unbookmarksController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { bookmarkValidator, unbookmarkValidator } from '~/validations/posts.validations'

const bookmarkRouter = Router()

/**
 * Description: Bookmark post
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.post(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(bookmarkValidator, 'body'),
  requestHandler(bookmarksController)
)

/**
 * Description: Unbookmark post
 * Path: /post/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.delete(
  '/post/:post_id',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(unbookmarkValidator, 'params'),
  requestHandler(unbookmarksController)
)
export default bookmarkRouter
