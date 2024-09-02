import { Router } from 'express'
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMyProfileController,
  getUserProfileController,
  likeController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  unFollowController,
  unLikeController,
  updateMyProfileController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordValidator,
  likeValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unFollowValidator,
  unLikeValidator
} from '~/middlewares/users.middlewares'
import { UpdateMyProfileReqBody } from '~/models/requestType/User.requests'
import { wrapRequestHandler } from '~/utils/handlers'

const userRouter = Router()
/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */
userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Register
 * Path: /register
 * Method: POST
 * Body: {name: string, email: string, password: string, confirm_password: string, date_of_birth: string}
 */
userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout
 * Path: /logout
 * Method: POST
 * Body: {refresh_token: string}
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Forgot password
 * Path: /forgot-password
 * Method: POST
 * Body: {email: string}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Reset password and update new password for user document
 * Path: /reset-password
 * Method: POST
 * Body: {password: string, confirm_password: string, forgot_password_token: string}
 */
userRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

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
  wrapRequestHandler(changePasswordController)
)

/**
 * Description: Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMyProfileController))

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
  wrapRequestHandler(updateMyProfileController)
)

/**
 * Description: Get user profile
 * Path: /:username
 * Method: GET
 */
userRouter.get('/:username', wrapRequestHandler(getUserProfileController))

/**
 * Description: Follow user
 * Path: /follow
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { followed_user_id: string }
 */
userRouter.post('/follow', accessTokenValidator, followValidator, wrapRequestHandler(followController))

/**
 * Description: Unfollow user
 * Path: follow/:user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.delete('/follow/:user_id', accessTokenValidator, unFollowValidator, wrapRequestHandler(unFollowController))

/**
 * Description: Like a post
 * Path: /like
 * Method: POST
 * Header: { Authorization: Bearer <access_token>}
 * Body: { liked_post_id: string }
 */
userRouter.post('/like', accessTokenValidator, likeValidator, wrapRequestHandler(likeController))

/**
 * Description: Unlike a post
 * Path: like/:liked_post_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token>}
 */
userRouter.delete('/like/:liked_post_id', accessTokenValidator, unLikeValidator, wrapRequestHandler(unLikeController))
export default userRouter
