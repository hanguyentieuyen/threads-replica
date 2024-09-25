import { PostReqBody } from '~/models/requestType/Post.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Post from '~/models/post.model'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'

class PostsService {
  async createPost({ user_id, body }: { user_id: string; body: PostReqBody }) {
    const data = await databaseService.posts.insertOne(
      new Post({
        user_id: new ObjectId(user_id),
        audience: body.audience,
        content: body.content,
        hashtags: body.hashtags,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type
      })
    )
    const newPost = await databaseService.posts.findOne({ _id: data.insertedId })
    return newPost
  }

  async getPostDetail(post_id: string) {
    const [data] = await databaseService.posts
      .aggregate<Post>([
        {
          $match: {
            _id: new ObjectId(post_id)
          }
        },
        {
          $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
          }
        },
        {
          $addFields: {
            mentions: {
              $map: {
                input: '$mentions',
                as: 'mention',
                in: {
                  _id: '$$mention._id',
                  name: '$$mention.name',
                  username: '$$mention.username'
                }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'post_id',
            as: 'bookmarks'
          }
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'post_children'
          }
        },
        {
          $addFields: {
            bookmark_count: {
              $size: '$bookmarks'
            },
            repost_count: {
              $size: {
                $filter: {
                  input: '$post_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', 1]
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            post_children: 0
          }
        }
      ])
      .toArray()

    if (!data) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: POSTS_MESSAGES.POST_NOT_FOUND
      })
    }
    return data
  }
}

const postsService = new PostsService()
export default postsService
