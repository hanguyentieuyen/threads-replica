import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { envConfig } from '~/utils/config'
import { createToken } from '~/utils/jwt'

class UsersService {
  private getAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return createToken({
      payload: { user_id, verify },
      privateKey: envConfig.jwtSecretAccessToken,
      options: {
        expiresIn: envConfig.accessTokenExpiresIn
      }
    })
  }

  private getRefreshToken({ user_id, verify, exp }: { user_id: string; verify: UserVerifyStatus; exp?: number }) {
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
  private getAccessAndRefreshToken() {}
  async login() {}
}

const usersService = new UsersService()
export default usersService
