import axios, { Axios, AxiosError, AxiosInstance } from 'axios'
import config from '~/constant/config'
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from './auth'
import { AuthResponse } from '~/types/auth.type'
import HttpStatusCode from '~/constant/httpStatusCode.enum'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  constructor() {
    // create instance
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 60 * 60 * 24, // 1 ngày
        'expire-refresh-token': 60 * 60 * 24 * 160 // 160 ngày
      }
    })
    // interceptor request or response before handling resquest or response
    this.instance.interceptors.request.use(
      (configInterceptors) => {
        // Do something before request is sent
        if (configInterceptors.headers && this.accessToken) {
          configInterceptors.headers.authorization = this.accessToken
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
          this.accessToken = ''
          this.refreshToken = ''
        }
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
        }

        // Case error code: 401 (wrong token, expired token, no token)
        if (isAxiosUnauthorizedError)

      }
    )
  }
}
const http = new Http().instance
export default http
