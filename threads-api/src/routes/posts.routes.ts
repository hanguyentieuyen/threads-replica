import { Router } from 'express'
import { createPostController } from '~/controllers/posts.controllers'
import { createPostValidator } from '~/middlewares/posts.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const postsRouter = Router()

/**
 * Description: Create a new post
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: PostRequestBody
 */
postsRouter.post('/', accessTokenValidator, createPostValidator, wrapRequestHandler(createPostController))

export default postsRouter
