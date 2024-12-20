import { Router } from 'express'
import { bookmarksController, unbookmarksController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'

const bookmarkRouter = Router()

/**
 * Description: Bookmark post
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.post('/', validateMiddleware(accessTokenValidator, 'headers'), requestHandler(bookmarksController))

/**
 * Description: Unbookmark post
 * Path: /post/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.delete(
  '/post/:post_id',
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(unbookmarksController)
)
export default bookmarkRouter
