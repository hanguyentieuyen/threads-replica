import { USERS_MESSAGES } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/httpStatus'

type ErrorsType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
> // {[key: string]: string}

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

// error code 402, validate form errors
export class EntityError extends ErrorWithStatus {
  errors: ErrorsType
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
