import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { CommentReqBody } from '~/models/requestType/Comment.requests'
import { POSTS_MESSAGES } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/error.model'
import Comment from '~/models/comment.model'
import CommentLike from '~/models/commentLike.model'

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
    return { comments, total }
  }

  async createComment({ user_id, post_id, body }: { user_id: string; post_id: string; body: CommentReqBody }) {
    const data = await databaseService.comments.insertOne(
      new Comment({
        user_id: new ObjectId(user_id),
        post_id: new ObjectId(post_id),
        content: body.content,
        parent_id: body.parent_id
      })
    )
    const newComment = await databaseService.comments.findOne({ _id: data.insertedId })
    if (!newComment) {
      throw new ErrorWithStatus({
        message: POSTS_MESSAGES.CREATE_COMMENT_FAILED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return newComment
  }

  async likeComment({ user_id, comment_id }: { user_id: string; comment_id: string }) {
    const data = await databaseService.commentLikes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), comment_id: new ObjectId(comment_id) },
      { $setOnInsert: new CommentLike({ user_id: new ObjectId(user_id), comment_id: new ObjectId(comment_id) }) },
      { upsert: true, returnDocument: 'after' }
    )
    return data
  }

  async unlikeComment({ user_id, comment_id }: { user_id: string; comment_id: string }) {
    const data = await databaseService.commentLikes.findOneAndDelete({
      user_id: new ObjectId(user_id),
      comment_id: new ObjectId(comment_id)
    })
    return data
  }
}

const commentsService = new CommentsService()
export default commentsService
