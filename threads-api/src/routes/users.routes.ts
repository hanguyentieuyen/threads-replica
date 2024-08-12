import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
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
export default userRouter
