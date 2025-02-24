import { ObjectId } from 'mongodb'
interface PostLikeConstructor {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date
}
export default class PostLike {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date

  constructor({ _id, user_id, created_at, post_id }: PostLikeConstructor) {
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.created_at = created_at || new Date()
    this.post_id = post_id
  }
}
