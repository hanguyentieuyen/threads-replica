import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { ParamsDictionary } from 'express-serve-static-core'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface VerifyEmailTokenReqBody {
  verify_email_token: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}
export interface ResetPasswordReqBody {
  password: string
  forgot_password_token: string
  confirm_password_token: string
}

export interface UpdateMyProfileReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
}

export interface ChangePasswordReqBody {
  password: string
}

export interface FollowReqBody {
  followed_user_id: string
}

export interface UnFollowReqBody extends ParamsDictionary {
  user_id: string
}

export interface GetUserFollowersReqBody extends ParamsDictionary {
  user_id: string
}

export interface GetUserFollowingReqBody extends ParamsDictionary {
  user_id: string
}

export interface GetUserProfileReqBody extends ParamsDictionary {
  username: string
}
