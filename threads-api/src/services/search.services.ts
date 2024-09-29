import { MediaType, MediaTypeQuery, PeopleFollow, PostType } from '~/constants/enum'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
type SearchType = {
  content: string
  limit: number
  page: number
  user_id: string
  media_type?: MediaTypeQuery
  people_follow?: PeopleFollow
}
class SearchService {
  async search({ limit, page, user_id, media_type, people_follow, content }: SearchType) {
    const filter: any = {
      $text: {
        $search: content
      }
    }
    // Handle media type
    if (media_type) {
      if (media_type === MediaTypeQuery.Image) {
        filter['medias.type'] = MediaType.Image
      }
      if (media_type === MediaTypeQuery.Video) {
        filter['medias.type'] = MediaType.Video
      }
    }
    // Handle posts from followed user
    if (people_follow && people_follow === PeopleFollow.Following) {
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
      ids.push(userId)
      filter['user_id'] = {
        $in: ids
      }
    }

    const [posts, total] = await Promise.all([
      databaseService.posts
        .aggregate([
          {
            $match: filter
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
                        $in: [new ObjectId(user_id)]
                      }
                    }
                  ]
                }
              ]
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
              post_children: 0,
              user: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                post_circle: 0,
                date_of_birth: 0
              }
            }
          },
          {
            $skip: limit * (page - 1)
          },
          {
            $limit: limit
          }
        ])
        .toArray(),

      databaseService.posts
        .aggregate([
          {
            $match: filter
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
                        $in: [new ObjectId(user_id)]
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
}

const searchService = new SearchService()
export default searchService
