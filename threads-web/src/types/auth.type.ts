/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */
import { SuccessResponse } from "./utils.type"

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
}>

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
