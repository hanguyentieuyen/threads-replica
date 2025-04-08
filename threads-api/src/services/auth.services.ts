import axios from 'axios'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { envConfig } from '~/utils/config'
import { createToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/refreshToken.model'
import { ErrorWithStatus } from '~/models/error.model'
import { USERS_MESSAGES } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { RegisterReqBody } from '~/models/requestType/User.requests'
import User from '~/models/user.model'
import { hashPassword } from '~/utils/hash'
import { sendForgotPasswordEmail, sendVerifyRegisterEmail } from '~/utils/mail'

class AuthService {
  private createtAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return createToken({
      payload: { user_id, verify, token_type: TokenType.AccessToken },
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
      payload: { user_id, verify, token_type: TokenType.EmailVerifyToken },
      privateKey: envConfig.jwtSecretVerifyMailToken,
      options: {
        expiresIn: envConfig.emailVerifyTokenExpiresIn
      }
    })
  }

  private createForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return createToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.ForgotPasswordToken
      },
      privateKey: envConfig.jwtSecretForgotPasswordToken,
      options: {
        expiresIn: envConfig.forgotPasswordTokenExpiresIn
      }
    })
  }

  private createAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.createtAccessToken({ user_id, verify }), this.createRefreshToken({ user_id, verify })])
  }

  private decodedRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: envConfig.jwtSecretRefreshToken
    })
  }

  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: envConfig.googleClientId,
      client_secret: envConfig.googleClientSecret,
      redirect_uri: envConfig.googleRedirectUri,
      grant_type: 'authorization_code'
    }
    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }

  private async getGoogleUserInfo(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  async verifyEmail(user_id: string) {
    const token = await this.createAccessAndRefreshToken({
      user_id,
      verify: UserVerifyStatus.Verified
    })

    // update verify and verify_email_token fields on document user
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      [
        {
          $set: {
            verify_email_token: '',
            verify: UserVerifyStatus.Verified
          }
        }
      ]
    )

    // create new refresh token
    const [access_token, refresh_token] = token
    const { iat, exp } = await this.decodedRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async getUserByEmail({ email }: { email: string }) {
    return await databaseService.users.findOne({ email })
  }

  async getUserByEmailPassword({ email, hashedPassword }: { email: string; hashedPassword: string }) {
    return await databaseService.users.findOne({ email, password: hashedPassword })
  }
  async getUserById(user_id: string) {
    return await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.createAccessAndRefreshToken({
      user_id,
      verify
    })
    const { iat, exp } = await this.decodedRefreshToken(refresh_token)
    // Insert refresh toke to db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
    }
  }

  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userInfo = await this.getGoogleUserInfo(access_token, id_token)
    if (!userInfo.verified_email) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.GMAIL_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    // Check email is registered
    const user = await databaseService.users.findOne({ email: userInfo.email })
    // if email exists, allow to login
    if (user) {
      const [access_token, refresh_token] = await this.createAccessAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      })
      const { iat, exp } = await this.decodedRefreshToken(refresh_token)
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ user_id: user._id, token: refresh_token, iat, exp })
      )
      return {
        access_token,
        refresh_token,
        newUser: 0,
        verify: user.verify
      }
    } else {
      // random string password
      const password = Math.random().toString(36).substring(2, 15)
      // if email is not existed then create
      const data = await this.register({
        email: userInfo.email,
        name: userInfo.name,
        username: userInfo.email,
        date_of_birth: new Date().toISOString(),
        password,
        confirm_password: password
      })
      return { ...data, newUser: 1, verify: UserVerifyStatus.Unverified }
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
        username: payload.username,
        password: hashPassword(payload.password),
        verify_email_token: emailVerifyToken
      })
    )

    // Return access token and refresh token
    const [access_token, refresh_token] = await this.createAccessAndRefreshToken({
      user_id: userId.toString(),
      verify: UserVerifyStatus.Unverified
    })

    const { iat, exp } = await this.decodedRefreshToken(refresh_token)
    // Insert refresh token to db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refresh_token, iat, exp })
    )

    // Todo: Send mail to verify registration
    await sendVerifyRegisterEmail(payload.email, emailVerifyToken)
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

  async refreshToken({
    user_id,
    verify,
    refresh_token,
    exp
  }: {
    user_id: string
    verify: UserVerifyStatus
    refresh_token: string
    exp: number
  }) {
    const [newAccessToken, newRefreshToken, _] = await Promise.all([
      this.createtAccessToken({ user_id, verify }),
      this.createRefreshToken({ user_id, verify, exp }),
      databaseService.refreshTokens.deleteOne({ token: refresh_token })
    ])

    const decodeRefreshToken = await this.decodedRefreshToken(refresh_token)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: newRefreshToken,
        iat: decodeRefreshToken.iat,
        exp: decodeRefreshToken.exp
      })
    )
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken
    }
  }

  async forgotPassword({ user_id, verify, email }: { user_id: string; verify: UserVerifyStatus; email: string }) {
    // Create new forgot password token
    const forgotPasswordToken = await this.createForgotPasswordToken({
      user_id,
      verify
    })
    // Update token for user document
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: forgotPasswordToken,
          updated_at: '$NOW'
        }
      }
    ])
    // Send mail included link to user mail: http://example.com/forgot-password?token=token
    console.log('forgotPasswordToken: ', forgotPasswordToken)
    await sendForgotPasswordEmail(email, forgotPasswordToken)
    return {
      message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
    }
  }

  async resetPassword({ user_id, password }: { user_id: string; password: string }) {
    await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password),
          updated_at: '$NOW'
        }
      }
    ])
    return {
      message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
    }
  }

  async changePassword({ user_id, password }: { user_id: string; password: string }) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return {
      message: USERS_MESSAGES.CHANGE_PASSWORD_SUCCESS
    }
  }
}

const authService = new AuthService()
export default authService
