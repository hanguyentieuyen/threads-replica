import { ObjectId } from 'mongodb'
interface CommentLikesConstructor {
  _id?: ObjectId
  user_id: ObjectId
  comment_id: ObjectId
  created_at?: Date
}
export default class CommentLike {
  _id?: ObjectId
  user_id: ObjectId
  comment_id: ObjectId
  created_at?: Date

  constructor({ _id, user_id, created_at, comment_id }: CommentLikesConstructor) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.created_at = created_at || new Date()
    this.comment_id = comment_id
  }
}
