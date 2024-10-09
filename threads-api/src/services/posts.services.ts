import { PostReqBody } from '~/models/requestType/Post.requests'
import databaseService from './database.services'
import { ObjectId, WithId } from 'mongodb'
import Post from '~/models/post.model'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { POSTS_MESSAGES } from '~/constants/messages'
import { PostType } from '~/constants/enum'
import HashTag from '~/models/hashtags.model'

class PostsService {
  // Handle hashtags
  async handleHashTags(hashtags: string[]) {
    const hashtagsDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        // Tìm hashtag trong database nếu có thì lấy ra, nếu ko có thì tạo mới
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new HashTag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )
    return hashtagsDocuments.map((hashtag) => hashtag?._id)
  }
  async createPost({ user_id, body }: { user_id: string; body: PostReqBody }) {
    const hashTagsIds = (await this.handleHashTags(body.hashtags)) as ObjectId[]
    const data = await databaseService.posts.insertOne(
      new Post({
        user_id: new ObjectId(user_id),
        audience: body.audience,
        content: body.content,
        hashtags: hashTagsIds,
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type
      })
    )
    const newPost = await databaseService.posts.findOne({ _id: data.insertedId })
    return newPost
  }

  // get post detail
  private matchPostDetailStage(post_id: string) {
    return {
      $match: {
        _id: new ObjectId(post_id)
      }
    }
  }

  private lookuPostDetailStage() {
    return [
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
      }
    ]
  }

  private addFieldsPostDetailStage() {
    return {
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
    }
  }

  private projectPostDetailStage() {
    return {
      $project: {
        post_children: 0
      }
    }
  }
  async getPostDetail(post_id: string) {
    const postDetailPipeline = [
      this.matchPostDetailStage(post_id),
      ...this.lookuPostDetailStage(),
      this.addFieldsPostDetailStage(),
      this.projectPostDetailStage()
    ]
    const [data] = await databaseService.posts.aggregate<Post>(postDetailPipeline).toArray()

    if (!data) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: POSTS_MESSAGES.POST_NOT_FOUND
      })
    }
    return data
  }

  // query my posts and follower posts (filter public post)
  private matchPostStage(ids: ObjectId[], userId: ObjectId) {
    return {
      $match: {
        user_id: {
          $in: ids
        },
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
    }
  }

  private lookupPostStage() {
    return [
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
      }
    ]
  }

  private addFieldsStage() {
    return {
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
    }
  }

  private paginationPostStage(limit: number, page: number) {
    return [
      {
        $skip: limit * (page - 1)
      },
      {
        $limit: limit
      }
    ]
  }
  private projectPostStage() {
    return {
      $project: {
        post_children: 0,
        user: {
          password: 0,
          verify_email_token: 0,
          forgot_password_token: 0,
          post_circle: 0,
          date_of_birth: 0
        }
      }
    }
  }
  private totalCountStage(ids: ObjectId[], userId: ObjectId) {
    return [
      this.matchPostStage(ids, userId),
      {
        $unwind: {
          path: '$user'
        }
      },
      {
        $count: 'total'
      }
    ]
  }
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

    const postPipline = [
      this.matchPostStage(ids, userId),
      ...this.lookupPostStage(),
      this.addFieldsStage(),
      this.projectPostStage(),
      ...this.paginationPostStage(limit, page)
    ]

    const [posts, total] = await Promise.all([
      databaseService.posts.aggregate(postPipline).toArray(),
      databaseService.posts.aggregate(this.totalCountStage(ids, userId)).toArray()
    ])

    return {
      posts,
      total: total[0]?.total || 0
    }
  }

  // Query children posts
  private getPostsPipeline(post_id: string, post_type: PostType, limit: number, page: number) {
    return [
      // Match posts based on parent_id and post type
      {
        $match: {
          parent_id: new ObjectId(post_id),
          type: post_type
        }
      },

      // Lookup hashtags by their _id
      {
        $lookup: {
          from: 'hashtags',
          localField: 'hashtags',
          foreignField: '_id',
          as: 'hashtags'
        }
      },

      // Lookup mentions by their _id
      {
        $lookup: {
          from: 'users',
          localField: 'mentions',
          foreignField: '_id',
          as: 'mentions'
        }
      },

      // Map mentions to return only specific fields
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

      // Lookup bookmarks related to the post
      {
        $lookup: {
          from: 'bookmarks',
          localField: '_id',
          foreignField: 'post_id',
          as: 'bookmarks'
        }
      },

      // Lookup children posts related to the current post
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'parent_id',
          as: 'post_children'
        }
      },

      // Add fields for bookmark count and repost count
      {
        $addFields: {
          bookmark_count: { $size: '$bookmarks' },
          repost_count: {
            $size: {
              $filter: {
                input: '$post_children',
                as: 'item',
                cond: { $eq: ['$$item.type', PostType.RePost] }
              }
            }
          }
        }
      },

      // Exclude children posts from the output
      {
        $project: {
          post_children: 0
        }
      },

      // Pagination: Skip and limit the results
      { $skip: limit * (page - 1) },
      { $limit: limit }
    ]
  }

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
      .aggregate(this.getPostsPipeline(post_id, post_type, limit, page))
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
