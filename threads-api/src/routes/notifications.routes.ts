/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Router } from 'express'
import { getNotificationsController } from '~/controllers/notifications.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { paginationValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/users.validations'

const notificationsRouter = Router()

/**
 * Description: Get notifications
 * Path: /
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 * Params: {limit: number, page: number, read: boolean, type: enum}
 */
// notificationsRouter.get(
//   '/',
//   validateMiddleware(accessTokenValidator, 'headers'),
//   validateMiddleware(paginationValidator, 'params'),
//   requestHandler(getNotificationsController)
// )
export default notificationsRouter
