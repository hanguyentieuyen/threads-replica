/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { ObjectId } from 'mongodb'
interface HashTagConstructor {
  _id?: ObjectId
  name: string
  created_at?: Date
}
export default class HashTag {
  _id?: ObjectId
  name: string
  created_at?: Date

  constructor({ _id, name, created_at }: HashTagConstructor) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.name = name
    this.created_at = created_at || date
  }
}
