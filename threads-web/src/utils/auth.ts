import { isAxiosError } from 'axios'
import HttpStatusCode from '~/constant/httpStatusCode.enum'

export const getAccessTokenFromLocalStorage = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem('refresh_token') || ''

export const setAccessTokenToLocalStorage = (access_token: string) => localStorage.setItem('access_token', access_token)

export const setRefreshTokenToLocalStorage = (refresh_token: string) =>
  localStorage.setItem('refresh_token', refresh_token)

export const isAxiosUnauthorizedError = (error: unknown) => {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
