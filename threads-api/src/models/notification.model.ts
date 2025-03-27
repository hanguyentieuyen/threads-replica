/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { ObjectId } from 'mongodb'
import { NotificationType } from '~/constants/enum'

interface NotificationConstructor {
  _id?: ObjectId
  type: NotificationType
  read: boolean
  recipent_id: string
  sender_id: string
  resource_id: string // ID of post or comment that was liked or commented on
  message: string
  created_at: Date
}

export default class Notification {
  _id?: ObjectId
  type: NotificationType
  read: boolean
  reciept_id: string
  sender_id: string
  resource_id: string
  message: string
  created_at: Date

  constructor({ _id, type, read, recipent_id, sender_id, resource_id, message, created_at }: NotificationConstructor) {
    const date = new Date()
    this._id = _id
    this.type = type
    this.read = read
    this.reciept_id = recipent_id
    this.sender_id = sender_id
    this.message = message
    this.resource_id = resource_id
    this.created_at = created_at || date
  }
}
