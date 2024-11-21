export interface User {
  _id?: string
  name: string
  email: string
  date_of_birth: string
  password: string
  created_at?: string
  updated_at?: string
  verify_email_token?: string
  verify?: number
  forgot_password_token?: string
  post_circle?: string[]
  bio?: string // optional
  location?: string // optional
  website?: string // optional
  username?: string // optional
  avatar?: string // optional
  cover_photo?: string // optional
}
