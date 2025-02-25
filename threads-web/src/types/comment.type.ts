export interface Comment {
  id: string
  content: string
  like_count: number
  username: string
  user_avatar: string
  created_at: string
  updated_at?: string
}

export interface Comments {
  page: number
  limit: number
  total_page: number
  comments: {
    id: string
    content: string
    like_count: number
    username: string
    user_avatar: string
    created_at: string
    updated_at?: string
    children_comments: Comment[]
  }
}

export interface NewComment {
  id: string
  user_id: string
  post_id: string
  content: string
  like_count: number
  created_at: string
  updated_at: string
}

export interface CommentLike {
  id: string
  comment_id: string
  user_id: string
  created_at: string
}
