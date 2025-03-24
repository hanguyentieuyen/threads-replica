import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMyProfileController,
  getUserBookmarksController,
  getUserFollowersController,
  getUserFollowingController,
  getUserProfileController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  searchUsersController,
  unFollowController,
  updateMyProfileController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/validations/common.validations'
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordValidator,
  getUserBookmarksValidator,
  getUserFollowersValidator,
  getUserFollowingValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  searchUserValidator,
  unFollowValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordValidator
} from '~/validations/users.validations'
import { UpdateMyProfileReqBody } from '~/models/requestType/User.requests'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { paginationValidator } from '~/validations/posts.validations'

const userRouter = Router()
/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */
userRouter.post('/login', validateMiddleware(loginValidator, 'body'), requestHandler(loginController))

/**
 * Description. OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * Query: { code: string }
 */
userRouter.get('/oauth/google', requestHandler(oauthController))

/**
 * Description: Register
 * Path: /register
 * Method: POST
 * Body: {name: string, email: string, password: string, confirm_password: string, date_of_birth: string}
 */
userRouter.post('/register', validateMiddleware(registerValidator, 'body'), requestHandler(registerController))
/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: { verify_email_token: string}
 */
userRouter.post(
  '/verify-email',
  validateMiddleware(verifyEmailTokenValidator, 'body'),
  requestHandler(verifyEmailController)
)
/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Body: {refresh_token: string}
 */
userRouter.post(
  '/logout',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(refreshTokenValidator, 'body'),
  requestHandler(logoutController)
)

/**
 * Description: Refresh token for user
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string}
 */
userRouter.post(
  '/refresh-token',
  validateMiddleware(refreshTokenValidator, 'body'),
  requestHandler(refreshTokenController)
)

/**
 * Description: Forgot password
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
userRouter.post(
  '/forgot-password',
  validateMiddleware(forgotPasswordValidator, 'body'),
  requestHandler(forgotPasswordController)
)

/**
 * Description: Verify link on email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
userRouter.post(
  '/verify-forgot-password',
  validateMiddleware(verifyForgotPasswordValidator, 'body'),
  requestHandler(verifyForgotPasswordController)
)
/**
 * Description: Reset password and update new password for user document
 * Path: /reset-password
 * Method: POST
 * Body: {password: string, confirm_password: string, forgot_password_token: string}
 */
userRouter.post(
  '/reset-password',
  validateMiddleware(resetPasswordValidator, 'body'),
  requestHandler(resetPasswordController)
)

/**
 * Description: Change password
 * Path: /reset-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token>}
 * Body: {old_password: string, password: string, confirm_password: string}
 */
userRouter.put(
  '/change-password',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(changePasswordValidator, 'body'),
  requestHandler(changePasswordController)
)

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
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
userRouter.get('/:username', requestHandler(getUserProfileController))

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
