/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { ObjectId } from 'mongodb'
interface FollowConstructor {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date
}
export default class Follow {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date

  constructor({ _id, user_id, created_at, followed_user_id }: FollowConstructor) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.user_id = user_id
    this.created_at = created_at || date
    this.followed_user_id = followed_user_id
  }
}
