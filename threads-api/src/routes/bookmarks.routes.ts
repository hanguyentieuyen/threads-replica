import { Router } from 'express'
import { bookmarksController, unbookmarksController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarkRouter = Router()

/**
 * Description: Bookmark tweet
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.post('/', accessTokenValidator, wrapRequestHandler(bookmarksController))

/**
 * Description: Unbookmark tweet
 * Path: /posts/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

bookmarkRouter.delete('/posts/:post_id', accessTokenValidator, wrapRequestHandler(unbookmarksController))
export default bookmarkRouter
