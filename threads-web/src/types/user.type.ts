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
  username: string // optional
  avatar?: string // optional
}

export interface Users {
  page: number
  limit: number
  total_page: number
  users: User[]
}
export interface UserFollowers {
  page: number
  limit: number
  total_page: number
  user_followers: {
    id: string
    name: string
    username: string
    avatar?: string
    bio?: string
  }[]
}

export interface UserFollowing {
  page: number
  limit: number
  total_page: number
  user_following: {
    id: string
    name: string
    username: string
    avatar?: string
    bio?: string
  }[]
}

export interface UsernameExist {
  exist: boolean
}
