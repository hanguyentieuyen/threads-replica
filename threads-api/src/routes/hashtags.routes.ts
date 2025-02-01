import { Router } from 'express'
import { createHashTagController, searchHashTagsController } from '~/controllers/hashtags.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { createHashTagsValidator, searchHashTagsValidator } from '~/validations/hashtags.validations'
import { accessTokenValidator } from '~/validations/users.validations'

const hashTagsRouter = Router()

/**
 * Description: Search hashtags
 * Path: /
 * Method: GET
 * Params: ?search=reactjs
 * Header: { Authorization: Bearer <access_token>}
 */
hashTagsRouter.get(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(searchHashTagsValidator, 'params'),
  requestHandler(searchHashTagsController)
)

/**
 * Description: Create hashtag
 * Path: /
 * Method: POST
 * Body: hashtag
 * Header: { Authorization: Bearer <access_token>}
 */
hashTagsRouter.post(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(createHashTagsValidator, 'body'),
  requestHandler(createHashTagController)
)

export default hashTagsRouter
