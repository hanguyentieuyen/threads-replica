import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Like from '~/models/like.model'

class LikesService {
  async likes(user_id: string, post_id: string) {
    const data = await databaseService.likes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      { $setOnInsert: new Like({ user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) }) },
      { upsert: true, returnDocument: 'after' }
    )
    return data
  }

  async unlikes(user_id: string, post_id: string) {
    const data = await databaseService.likes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })
    return data
  }
}

const likesService = new LikesService()
export default likesService
