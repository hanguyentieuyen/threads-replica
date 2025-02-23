import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Bookmark from '~/models/bookmark.model'

class BookmarksService {
  async bookmarks(user_id: string, post_id: string) {
    const data = await databaseService.postBookmarks.findOneAndUpdate(
      { user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) },
      { $setOnInsert: new Bookmark({ user_id: new ObjectId(user_id), post_id: new ObjectId(post_id) }) },
      { upsert: true, returnDocument: 'after' }
    )
    return data
  }

  async unbookmarks(user_id: string, post_id: string) {
    const data = await databaseService.postBookmarks.findOneAndDelete({
      user_id: new ObjectId(user_id),
      post_id: new ObjectId(post_id)
    })
    return data
  }
}

const bookmarksService = new BookmarksService()
export default bookmarksService
