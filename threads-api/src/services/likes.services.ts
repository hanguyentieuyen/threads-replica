import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Like from '~/models/schemas/Like.schema'

class LikesService {
  async likes(user_id: string, post_id: string) {
    const result = await databaseService.likes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      { $setOnInsert: new Like({ user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) }) },
      { upsert: true, returnDocument: 'after' }
    )
    return result
  }

  async unlikes(user_id: string, post_id: string) {
    const result = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })
    return result
  }
}

const likesService = new LikesService()
export default likesService
