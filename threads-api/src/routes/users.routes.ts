/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Router } from 'express'
import {
  followController,
  getMyProfileController,
  getUserBookmarksController,
  getUserFollowersController,
  getUserFollowingController,
  getUserProfileController,
  searchUsersController,
  unFollowController,
  updateMyProfileController,
  usernameController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/validations/common.validations'
import {
  followValidator,
  getUserBookmarksValidator,
  getUserFollowersValidator,
  getUserFollowingValidator,
  searchUserValidator,
  unFollowValidator,
  usernameValidator
} from '~/validations/users.validations'
import { UpdateMyProfileReqBody } from '~/models/requestType/User.requests'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { paginationValidator } from '~/validations/posts.validations'
import { accessTokenValidator } from '~/validations/auth.validations'

const userRouter = Router()

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.get('/me', validateMiddleware(accessTokenValidator, 'headers'), requestHandler(getMyProfileController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token>}
 * Body: UserSchema
 */
userRouter.patch(
  '/me',
  validateMiddleware(accessTokenValidator, 'headers'),
  filterMiddleware<UpdateMyProfileReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar'
  ]),
  requestHandler(updateMyProfileController)
)

/**
 * Description: Check username exists
 * Path: /check-username
 * Method: GET
 * Query: username="hayen"
 */
userRouter.get('/check-username', validateMiddleware(usernameValidator, 'params'), requestHandler(usernameController))

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
userRouter.get(
  '/:username',
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(getUserProfileController)
)

/**
 * Description: Follow user
 * Path: /follow
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { followed_user_id: string }
 */
userRouter.post(
  '/follow',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(followValidator, 'body'),
  requestHandler(followController)
)

/**
 * Description: Unfollow user
 * Path: follow/:user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.delete(
  '/follow/:user_id',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(unFollowValidator, 'params'),
  requestHandler(unFollowController)
)

/**
 * Description: Get user followers
 * Path: :user_id/followers
 * Method: GET
 */
userRouter.get(
  '/:user_id/followers',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(getUserFollowersValidator, 'params'),
  requestHandler(getUserFollowersController)
)

/**
 * Description: Get user followers
 * Path: :user_id/followers
 * Method: GET
 */
userRouter.get(
  '/:user_id/following',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(getUserFollowingValidator, 'params'),
  requestHandler(getUserFollowingController)
)

/**
 * Description: Get user bookmarks
 * Path: :user_id/bookmarks
 * Method: GET
 */
userRouter.get(
  '/:user_id/bookmarks',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(getUserBookmarksValidator, 'params'),
  requestHandler(getUserBookmarksController)
)

/**
 * Description: Search text user
 * Path: /
 * Method: GET
 * Query: query="username"
 */
userRouter.get(
  '/',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(paginationValidator, 'params'),
  validateMiddleware(searchUserValidator, 'params'),
  requestHandler(searchUsersController)
)

export default userRouter
