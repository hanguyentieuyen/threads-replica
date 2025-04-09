/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { accessTokenValidator } from '~/validations/auth.validations'
import { paginationValidator } from '~/validations/posts.validations'
import { searchValidator } from '~/validations/search.validations'

const searchRouter = Router()
searchRouter.get(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(paginationValidator, 'params'),
  validateMiddleware(searchValidator, 'params'),
  requestHandler(searchController)
)

export default searchRouter
