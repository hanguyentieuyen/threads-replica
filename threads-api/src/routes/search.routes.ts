import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { paginationValidator } from '~/validations/posts.validations'
import { searchValidator } from '~/validations/search.validations'
import { accessTokenValidator } from '~/validations/users.validations'

const searchRouter = Router()
searchRouter.get(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(paginationValidator, 'params'),
  validateMiddleware(searchValidator, 'params'),
  requestHandler(searchController)
)

export default searchRouter
