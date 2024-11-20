export interface Post {
  _id?: string
  user_id: string
  type: number
  audience: number
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: string[]
  guest_views: number
  user_views: number
  created_at: string
  updated_at: string
}
export interface Posts {
  posts: Post[]
  page: number
  limit: number
  totalPage: number
}
