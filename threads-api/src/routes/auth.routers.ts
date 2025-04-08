import { Router } from 'express'
import {
  changePasswordController,
  forgotPasswordController,
  loginController,
  logoutController,
  oauthController,
  refreshTokenController,
  registerController,
  resetPasswordController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/auth.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import {
  accessTokenValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordValidator
} from '~/validations/auth.validations'

const authRouter = Router()
/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */
authRouter.post('/login', validateMiddleware(loginValidator, 'body'), requestHandler(loginController))

/**
 * Description. OAuth with Google
 * Path: /oauth/google
 * Method: GET
 * Query: { code: string }
 */
authRouter.get('/oauth/google', requestHandler(oauthController))

/**
 * Description: Register
 * Path: /register
 * Method: POST
 * Body: {name: string, username: string, email: string, password: string, confirm_password: string, date_of_birth: string}
 */
authRouter.post('/register', validateMiddleware(registerValidator, 'body'), requestHandler(registerController))
/**
 * Description: Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: { verify_email_token: string}
 */
authRouter.post(
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
authRouter.post(
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
authRouter.post(
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
authRouter.post(
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
authRouter.post(
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
authRouter.post(
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
authRouter.put(
  '/change-password',
  validateMiddleware(accessTokenValidator, 'headers'),
  validateMiddleware(changePasswordValidator, 'body'),
  requestHandler(changePasswordController)
)

export default authRouter
