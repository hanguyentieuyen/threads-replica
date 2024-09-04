import { Router } from 'express'
import { likesController, unlikesController } from '~/controllers/likes.controllers'
import { likeValidator, unlikeValidator } from '~/middlewares/posts.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const likeRouter = Router()

/**
 * Description: Like Post
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

likeRouter.post('/', accessTokenValidator, likeValidator, wrapRequestHandler(likesController))

/**
 * Description: Unlike Post
 * Path: /posts/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

likeRouter.delete('/posts/:post_id', accessTokenValidator, unlikeValidator, wrapRequestHandler(unlikesController))
export default likeRouter
