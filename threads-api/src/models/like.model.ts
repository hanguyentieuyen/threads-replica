import { ObjectId } from 'mongodb'
interface LikerContructor {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date
}
export default class Like {
  _id?: ObjectId
  user_id: ObjectId
  post_id: ObjectId
  created_at?: Date

  constructor({ _id, user_id, created_at, post_id }: LikerContructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.created_at = created_at || date
    this.post_id = post_id
  }
}