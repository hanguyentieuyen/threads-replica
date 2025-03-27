/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { User } from "./user.type"

export interface Post {
  _id: string
  user_id: string
  type: number
  audience: number
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: string[]
  user: User
  guest_views?: number
  user_views?: number
  bookmark_count: number
  like_count: number
  created_at?: string
  updated_at?: string
}
export interface Posts {
  posts: Post[]
  page: number
  limit: number
  total_page: number
}
