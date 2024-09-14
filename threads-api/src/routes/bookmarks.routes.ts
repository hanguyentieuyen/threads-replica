import { Router } from 'express'
import { bookmarksController, unbookmarksController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandler'

const bookmarkRouter = Router()

/**
 * Description: Bookmark post
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.post('/', accessTokenValidator, requestHandler(bookmarksController))

/**
 * Description: Unbookmark post
 * Path: /posts/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.delete('/posts/:post_id', accessTokenValidator, requestHandler(unbookmarksController))
export default bookmarkRouter
