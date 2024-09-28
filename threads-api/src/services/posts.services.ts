import { PostReqBody } from '~/models/requestType/Post.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Post from '~/models/post.model'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'
import { PostType } from '~/constants/enum'

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
                    $eq: ['$$item.type', PostType.RePost]
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

  // query my posts and follower posts (filter public post)
  async getPosts({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const userId = new ObjectId(user_id)
    const followedUserIds = await databaseService.follows
      .find(
        { user_id: userId },
        {
          projection: {
            followed_user_id: 1,
            _id: 0
          }
        }
      )
      .toArray()
    const ids = followedUserIds.map((item) => item.followed_user_id)
    // push my user_id into ids (included my user_id and user_id of followers)
    ids.push(userId)
    const [posts, total] = await Promise.all([
      databaseService.posts
        .aggregate([
          {
            $match: {
              user_id: {
                $in: ids
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.post_circle': {
                        $in: [userId]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
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
                      $eq: ['$$item.type', PostType.RePost]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              post_children: 0,
              user: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                post_circle: 0,
                date_of_birth: 0
              }
            }
          }
        ])
        .toArray(),
      databaseService.posts
        .aggregate([
          {
            $match: {
              user_id: {
                $in: ids
              }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'user_id',
              foreignField: '_id',
              as: 'user'
            }
          },
          {
            $unwind: {
              path: '$user'
            }
          },
          {
            $match: {
              $or: [
                {
                  audience: 0
                },
                {
                  $and: [
                    {
                      audience: 1
                    },
                    {
                      'user.post_circle': {
                        $in: [userId]
                      }
                    }
                  ]
                }
              ]
            }
          },
          {
            $count: 'total'
          }
        ])
        .toArray()
    ])

    return {
      posts,
      total: total[0]?.total || 0
    }
  }

  // query children posts
  async getPostChildren({
    post_id,
    post_type,
    limit,
    page,
    user_id
  }: {
    post_id: string
    post_type: PostType
    limit: number
    page: number
    user_id?: string
  }) {
    const posts = await databaseService.posts
      .aggregate<Post>([
        {
          $match: {
            parent_id: new ObjectId(post_id),
            type: post_type
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
            foreignField: 'tweet_id',
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
                  input: '$tweet_children',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.type', PostType.RePost]
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
        },
        {
          $skip: limit * (page - 1) // phân trang
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.posts.countDocuments({
      parent_id: new ObjectId(post_id),
      type: post_type
    })

    return { posts, total }
  }
}

const postsService = new PostsService()
export default postsService
