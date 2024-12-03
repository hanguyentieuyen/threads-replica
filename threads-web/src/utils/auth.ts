import { AxiosError, isAxiosError } from "axios"
import HttpStatusCode from "~/constant/httpStatusCode.enum"
import { User } from "~/types/user.type"
import { ErrorResponse } from "~/types/utils.type"
export const LocalStorageEventTarget = new EventTarget()

export const getAccessTokenFromLocalStorage = () => localStorage.getItem("access_token") || ""

export const getRefreshTokenFromLocalStorage = () => localStorage.getItem("refresh_token") || ""

export const setAccessTokenToLocalStorage = (access_token: string) => localStorage.setItem("access_token", access_token)

export const setRefreshTokenToLocalStorage = (refresh_token: string) =>
  localStorage.setItem("refresh_token", refresh_token)

export const getProfileFromLocalStorage = () => {
  const result = localStorage.getItem("user_profile")
  return result ? JSON.parse(result) : null
}
export const setProfileToLocalStorage = (profile: User) => {
  localStorage.setItem("user_profile", JSON.stringify(profile))
}

export const clearLocalStorage = () => {
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user_profile")

  const clearLocalStorageEvent = new Event("clearLocalStorage")
  LocalStorageEventTarget.dispatchEvent(clearLocalStorageEvent)
}
export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data.errors?.name === "EXPIRED_TOKEN"
  )
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
