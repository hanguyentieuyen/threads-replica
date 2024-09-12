import { Router } from 'express'
import { likesController, unlikesController } from '~/controllers/likes.controllers'
import { likeValidator, unlikeValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandlers'

const likeRouter = Router()

/**
 * Description: Like Post
 * Path: /
 * Method: POST
 * Body: {post_id: string}
 * Header: { Authorization: Bearer <access_token>}
 */

likeRouter.post('/', accessTokenValidator, likeValidator, requestHandler(likesController))

/**
 * Description: Unlike Post
 * Path: /posts/:post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */

likeRouter.delete('/posts/:post_id', accessTokenValidator, unlikeValidator, requestHandler(unlikesController))
export default likeRouter
