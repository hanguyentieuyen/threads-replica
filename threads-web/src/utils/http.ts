import axios, { AxiosError, type AxiosInstance } from "axios"
import config from "~/constant/config"
import { toast } from "react-toastify"
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  isAxiosExpiredTokenError,
  isAxiosUnauthorizedError,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from "./auth"
import { AuthResponse } from "~/types/auth.type"
import HttpStatusCode from "~/constant/httpStatusCode.enum"
import { ErrorResponse } from "~/types/utils.type"

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    // create instance
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 60 * 60 * 24, // 1 ngày
        "expire-refresh-token": 60 * 60 * 24 * 160 // 160 ngày
      }
    })
    // interceptor request or response before handling resquest or response
    this.instance.interceptors.request.use(
      (configInterceptors) => {
        // Do something before request is sent
        if (configInterceptors.headers && this.accessToken) {
          configInterceptors.headers.authorization = `Bearer ${this.accessToken}`
          return configInterceptors
        }
        return configInterceptors
      },
      // Do something with request error
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        //Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const { url } = response.config
        if (url === config.loginUrl || url === config.registerUrl) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          // Store token in local storage
          setAccessTokenToLocalStorage(this.accessToken)
          setRefreshTokenToLocalStorage(this.refreshToken)
        } else if (url === config.logoutUrl) {
          this.accessToken = ""
          this.refreshToken = ""
          clearLocalStorage()
        }
        return response
      },
      (error: AxiosError) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        // Just check error code: 401 and 422
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.data as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          // toast message here
          toast.error(message)
        }

        // Case error code: 401 (wrong token, expired token, no token)
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const configError = error.response?.config || { headers: {}, url: "" }
          const { url } = configError

          // Case error: token expired and current request is not refresh token request , then request refresh token
          if (isAxiosExpiredTokenError(error) && url !== config.refreshTokenUrl) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return (
              this.refreshTokenRequest &&
              this.refreshTokenRequest.then((access_token) => {
                if (configError.headers) configError.headers.authorization = access_token
                // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                return this.instance({
                  ...configError,
                  headers: { ...configError.headers, authorization: access_token }
                })
              })
            )
          }

          // Other error cases: wrong token, miss token, refresh token fail. Show toast
          clearLocalStorage()
          this.accessToken = ""
          this.refreshToken = ""
          toast.error(error.response?.data.errors?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post(config.refreshTokenUrl, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLocalStorage(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLocalStorage()
        this.accessToken = ""
        this.refreshToken = ""
        throw error
      })
  }
}
const http = new Http().instance
export default http
