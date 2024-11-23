import config from "~/constant/config"
import { AuthResponse } from "~/types/auth.type"
import http from "~/utils/http"

export const authApi = {
  register: (body: { email: string; password: string }) => http.post<AuthResponse>(config.registerUrl, body),
  login: (body: { email: string; password: string }) => http.post<AuthResponse>(config.loginUrl, body),
  logout: () => http.post(config.logoutUrl),
  forgotPassword: (body: { email: string }) => http.post(config.forgotPassword, body),

  verifyForgotPassword: (body: { forgot_password_token: string | null }) =>
    http.post(config.verifyForgotPassword, body),

  resetPassword: (body: { forgot_password_token: string; password: string; confirm_password: string }) =>
    http.post(config.resetPassword, body),

  verifyEmail: (body: { verify_email_token: string | null }) => http.post(config.verifyEmail, body),
  changePassword: (body: { password: string; old_password: string }) => http.post(config.changePassword, body)
}
