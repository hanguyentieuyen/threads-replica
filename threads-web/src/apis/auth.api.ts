/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import apiEndpoints from "~/constant/config"
import { AuthResponse } from "~/types/auth.type"
import axiosInstance from "~/utils/axios"

export const authApi = {
  register: (body: { email: string; password: string }) =>
    axiosInstance.post<AuthResponse>(apiEndpoints.auth.register, body),
  login: (body: { email: string; password: string }) => axiosInstance.post<AuthResponse>(apiEndpoints.auth.login, body),
  logout: (body: { refresh_token: string }) => axiosInstance.post<AuthResponse>(apiEndpoints.auth.logout, body),
  forgotPassword: (body: { email: string }) => axiosInstance.post(apiEndpoints.auth.forgotPassword, body),

  verifyForgotPassword: (body: { forgot_password_token: string | null }) =>
    axiosInstance.post(apiEndpoints.auth.verifyForgotPassword, body),

  resetPassword: (body: { forgot_password_token: string; password: string; confirm_password: string }) =>
    axiosInstance.post(apiEndpoints.auth.resetPassword, body),

  verifyEmail: (body: { verify_email_token: string | null }) => axiosInstance.post(apiEndpoints.auth.verifyEmail, body),
  changePassword: (body: { password: string; old_password: string }) =>
    axiosInstance.put(apiEndpoints.auth.changePassword, body),

  loginWithGoogle: () => axiosInstance.get(apiEndpoints.auth.loginWithGoogle)
}
