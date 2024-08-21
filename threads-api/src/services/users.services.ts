import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { envConfig } from '~/utils/config'
import { createToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { RegisterReqBody } from '~/models/requestType/User.requests'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/hash'
import { USERS_MESSAGES } from '~/constants/messages'

class UsersService {
  private createtAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return createToken({
      payload: { user_id, verify },
      privateKey: envConfig.jwtSecretAccessToken,
      options: {
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }

  private createRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
    if (exp) {
      return createToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          verify,
          exp
        },
        privateKey: envConfig.jwtSecretRefreshToken
      })
    }
    return createToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: envConfig.jwtSecretRefreshToken,
      options: {
        expiresIn: envConfig.refreshTokenExpiresIn
      }
    })
  }

  private createEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return createToken({
      payload: { user_id, verify },
      privateKey: envConfig.jwtSecretVerifyMailToken,
      options: {
        expiresIn: envConfig.emailVerifyTokenExpiresIn
      }
    })
  }

  private createAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.createtAccessToken({ user_id, verify }), this.createRefreshToken({ user_id, verify })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken
    })
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.createAccessAndRefreshToken({
      user_id,
      verify
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    // Insert refresh toke to db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async register(payload: RegisterReqBody) {
    const userId = new ObjectId()
    const emailVerifyToken = await this.createEmailVerifyToken({
      user_id: userId.toString(),
      verify: UserVerifyStatus.Unverified
    })

    // Insert user into db
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: userId,
        date_of_birth: new Date(payload.date_of_birth),
        username: `user${userId.toString()}`,
        password: hashPassword(payload.password),
        email_verify_token: emailVerifyToken
      })
    )

    // Return access token and refresh token
    const [access_token, refresh_token] = await this.createAccessAndRefreshToken({
      user_id: userId.toString(),
      verify: UserVerifyStatus.Unverified
    })

    const { iat, exp } = await this.decodeRefreshToken(refresh_token)
    // Insert refresh token to db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async logout(refreshToken: string) {
    await databaseService.refreshTokens.deleteOne({ token: refreshToken })
    return {
      message: USERS_MESSAGES.LOGOUT_SUCCESS
    }
  }
}

const usersService = new UsersService()
export default usersService
