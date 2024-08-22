import config from '~/constant/config'
import { AuthResponse } from '~/types/auth.type'
import http from '~/utils/http'

export const authApi = {
  register: (body: { email: string; password: string }) => http.post<AuthResponse>(config.registerUrl, body),
  login: (body: { email: string; password: string }) => http.post<AuthResponse>(config.loginUrl, body),
  logout: () => http.post(config.logoutUrl),
  forgotPassword: (body: { email: string }) => http.post(config.forgotPassword, body)
}
