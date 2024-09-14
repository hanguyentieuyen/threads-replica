import { Router } from 'express'
import { createPostController } from '~/controllers/posts.controllers'
import { createPostValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/users.validations'
import { requestHandler } from '~/utils/requestHandler'

const postsRouter = Router()

/**
 * Description: Create a new post
 * Path: /
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: PostRequestBody
 */
postsRouter.post('/', accessTokenValidator, createPostValidator, requestHandler(createPostController))

export default postsRouter
