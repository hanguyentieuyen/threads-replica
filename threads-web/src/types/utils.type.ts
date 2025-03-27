/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */
export type SuccessResponse<Data> = {
  message: string
  data?: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors?: Data
}
