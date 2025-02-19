import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class CommentsService {
  async getComments({ post_id, limit, page }: { post_id: string; limit: number; page: number }) {
    const comments = await databaseService.comments
      .aggregate([
        { $match: { post_id: new ObjectId(post_id), parent_id: null } },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'children_comments'
          }
        },

        { $sort: { created_at: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ])
      .toArray()

    // Just count parent comments
    const total = await databaseService.comments.countDocuments({ post_id: new ObjectId(post_id), parent_id: null })
    console.log(comments)
    return { comments, total }
  }
}

const commentsService = new CommentsService()
export default commentsService
