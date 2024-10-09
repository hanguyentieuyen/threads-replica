import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMyProfileController,
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  unFollowController,
  updateMyProfileController,
  verifyEmailController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/validations/common.validations'
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowValidator,
  verifyEmailTokenValidator
} from '~/validations/users.validations'
import { UpdateMyProfileReqBody } from '~/models/requestType/User.requests'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'

const userRouter = Router()
/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */
userRouter.post('/login', validateMiddleware(loginValidator, 'body'), requestHandler(loginController))

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
    'avatar',
    'cover_photo'
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

export default userRouter
