import { Router } from 'express'
import { searchHashTagsController } from '~/controllers/hashtags.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { searchHashTagsValidator } from '~/validations/hashtags.validations'

const hashTagsRouter = Router()

/**
 * Description: Search hash tags
 * Path: /
 * Method: GET
 * Params: ?search=reactjs
 * Header: { Authorization: Bearer <access_token>}
 */
hashTagsRouter.get('/', validateMiddleware(searchHashTagsValidator, 'params'), requestHandler(searchHashTagsController))

export default hashTagsRouter
