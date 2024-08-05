import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'

const userRouter = Router()

/**
 * Description: Login
 * Path: /login
 * Method: POST
 * Body: {email: string, password: string}
 */
userRouter.post('/login', loginValidator, loginController)

export default userRouter
