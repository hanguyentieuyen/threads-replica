export type SuccessResponse<Data> = {
  message: string
  result: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors?: Data
}
