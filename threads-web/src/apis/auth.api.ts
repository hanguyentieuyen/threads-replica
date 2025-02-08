import apiEndpoints from "~/constant/config"
import { AuthResponse } from "~/types/auth.type"
import axiosInstance from "~/utils/axios"

export const authApi = {
  register: (body: { email: string; password: string }) =>
    axiosInstance.post<AuthResponse>(apiEndpoints.registerUrl, body),
  login: (body: { email: string; password: string }) => axiosInstance.post<AuthResponse>(apiEndpoints.loginUrl, body),
  logout: (body: { refresh_token: string }) => axiosInstance.post<AuthResponse>(apiEndpoints.logoutUrl, body),
  forgotPassword: (body: { email: string }) => axiosInstance.post(apiEndpoints.forgotPassword, body),

  verifyForgotPassword: (body: { forgot_password_token: string | null }) =>
    axiosInstance.post(apiEndpoints.verifyForgotPassword, body),

  resetPassword: (body: { forgot_password_token: string; password: string; confirm_password: string }) =>
    axiosInstance.post(apiEndpoints.resetPassword, body),

  verifyEmail: (body: { verify_email_token: string | null }) => axiosInstance.post(apiEndpoints.verifyEmail, body),
  changePassword: (body: { password: string; old_password: string }) =>
    axiosInstance.put(apiEndpoints.changePassword, body)
}
