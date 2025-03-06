import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { CommentReqBody } from '~/models/requestType/Comment.requests'
import { COMMENTS_MESSAGES, POSTS_MESSAGES } from '~/constants/messages'
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

        {
          $lookup: {
            from: 'comment_likes',
            localField: '_id',
            foreignField: 'comment_id',
            as: 'comment_likes'
          }
        },
        {
          $addFields: {
            like_count: { $size: '$comment_likes' }
          }
        },
        {
          $project: {
            comment_likes: 0
          }
        },
        {
          $lookup: {
            from: 'comment_likes',
            localField: 'children_comments._id',
            foreignField: 'comment_id',
            as: 'comment_likes_child'
          }
        },
        {
          $addFields: {
            'children_comments.like_count': { $size: '$comment_likes_child' }
          }
        },
        {
          $project: {
            comment_likes_child: 0
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user_details'
          }
        },
        {
          $unwind: { path: '$user_details', preserveNullAndEmptyArrays: true }
        },
        {
          $addFields: {
            username: '$user_details.username',
            user_avatar: '$user_details.avatar'
          }
        },
        {
          $project: {
            user_details: 0
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'children_comments.user_id',
            foreignField: '_id',
            as: 'user_details_child'
          }
        },
        {
          $unwind: { path: '$user_details_child', preserveNullAndEmptyArrays: true }
        },
        {
          $addFields: {
            'children_comments.username': '$user_details_child.username',
            'children_comments.user_avatar': '$user_details_child.avatar'
          }
        },
        {
          $project: {
            user_details_child: 0
          }
        },
        {
          $project: {
            user_id: 0,
            post_id: 0,
            parent_id: 0,
            updated_at: 0,
            children_comments: {
              user_id: 0,
              post_id: 0,
              parent_id: 0,
              updated_at: 0
            }
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

  async updateComment({ id, content }: { id: string; content: string }) {
    const data = await databaseService.comments.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { content, updated_at: new Date() } },
      { returnDocument: 'after' } // return comment after update
    )

    if (!data) {
      throw new ErrorWithStatus({
        message: COMMENTS_MESSAGES.COMMENT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    return data
  }

  async deleteComment({ id }: { id: string }) {
    const comment = await databaseService.comments.findOne({ _id: new ObjectId(id) })
    if (!comment) {
      throw new ErrorWithStatus({
        message: COMMENTS_MESSAGES.COMMENT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const commentIdsToDelete = [new ObjectId(id)]

    // parent comment
    if (comment.parent_id === null) {
      // get child comment of parent comment
      const childComments = await databaseService.comments.find({ parent_id: new ObjectId(id) }).toArray()

      const childCommentIds = childComments.map((c) => c._id)
      commentIdsToDelete.push(...childCommentIds)
    }

    // delete comment (child + parent)
    await databaseService.comments.deleteMany({ _id: { $in: commentIdsToDelete } })

    // delete likes of deleted comment
    await databaseService.commentLikes.deleteMany({ comment_id: { $in: commentIdsToDelete } })
    return {
      message: COMMENTS_MESSAGES.DELETE_SUCCESS
    }
  }

  async likeComment({ user_id, comment_id }: { user_id: string; comment_id: string }) {
    const data = await databaseService.commentLikes.findOneAndUpdate(
      { user_id: new ObjectId(user_id), comment_id: new ObjectId(comment_id) },
      { $setOnInsert: new CommentLike({ user_id: new ObjectId(user_id), comment_id: new ObjectId(comment_id) }) }, // create new if don't find one
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
