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
  updateMyProfileController
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
  unFollowValidator
} from '~/validations/users.validations'
import { UpdateMyProfileReqBody } from '~/models/requestType/User.requests'
import { requestHandler } from '~/utils/requestHandler'

const userRouter = Router()
/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */
userRouter.post('/login', loginValidator, requestHandler(loginController))

/**
 * Description: Register
 * Path: /register
 * Method: POST
 * Body: {name: string, email: string, password: string, confirm_password: string, date_of_birth: string}
 */
userRouter.post('/register', registerValidator, requestHandler(registerController))

/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Body: {refresh_token: string}
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, requestHandler(logoutController))

/**
 * Description: Forgot password
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, requestHandler(forgotPasswordController))

/**
 * Description: Reset password and update new password for user document
 * Path: /reset-password
 * Method: POST
 * Body: {password: string, confirm_password: string, forgot_password_token: string}
 */
userRouter.post('/reset-password', resetPasswordValidator, requestHandler(resetPasswordController))

/**
 * Description: Change password
 * Path: /reset-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token>}
 * Body: {old_password: string, password: string, confirm_password: string}
 */
userRouter.put(
  '/change-password',
  accessTokenValidator,
  changePasswordValidator,
  requestHandler(changePasswordController)
)

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.get('/me', accessTokenValidator, requestHandler(getMyProfileController))

/**
 * Description: Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token>}
 * Body: UserSchema
 */
userRouter.patch(
  '/me',
  accessTokenValidator,
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
userRouter.post('/follow', accessTokenValidator, followValidator, requestHandler(followController))

/**
 * Description: Unfollow user
 * Path: follow/:user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.delete('/follow/:user_id', accessTokenValidator, unFollowValidator, requestHandler(unFollowController))

export default userRouter
