import { ObjectId } from 'mongodb'

interface CommentConstructor {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  parent_id: string | null // id of parent comment (if comment is nested)
  content: string
  like_count?: number
  created_at?: Date
  updated_at?: Date
}

export default class Comment {
  _id: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  parent_id: ObjectId | null
  content: string
  like_count: number
  created_at: Date
  updated_at: Date
  constructor({ _id, user_id, post_id, parent_id, content, like_count, created_at, updated_at }: CommentConstructor) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.post_id = post_id
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.content = content
    this.like_count = like_count || 0
    this.created_at = created_at || new Date()
    this.updated_at = updated_at || new Date()
  }
}
