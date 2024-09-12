import { Request } from 'express'
import User from './models/user.model'
import { TokenPayload } from './models/requests/User.requests'
import Post from './models/post.model'

declare module 'express' {
  interface Request {
    user?: User
    decodedAuthorization?: TokenPayload
    decodedRefreshToken?: TokenPayload
    decodedEmailVerifyToken?: TokenPayload
    decodedForgotPasswordToken?: TokenPayload
    post?: Post
  }
}
