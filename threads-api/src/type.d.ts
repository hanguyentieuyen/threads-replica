/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Request } from 'express'
import User from './models/user.model'
import { TokenPayload } from './models/requests/User.requests'
import Post from './models/post.model'

declare module 'express' {
  interface Request {
    user?: User
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedVerifyEmailToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
    post?: Post
    validateData?: any
  }
}
