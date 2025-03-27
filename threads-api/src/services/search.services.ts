/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

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
  private getPostsPipeline(filter: any, user_id: string, limit: number, page: number) {
    return [
      // Match posts based on filter
      { $match: filter },

      // Lookup user info by user_id
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },

      // Filter posts based on audience and user's post circle
      {
        $match: {
          $or: [
            { audience: 0 },
            {
              $and: [{ audience: 1 }, { 'user.post_circle': { $in: [new ObjectId(user_id)] } }]
            }
          ]
        }
      },

      // Lookup hashtags and mentions
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

      // Map mentions to include only specific fields
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

      // Lookup bookmarks and post children
      {
        $lookup: {
          from: 'bookmarks',
          localField: '_id',
          foreignField: 'post_id',
          as: 'bookmarks'
        }
      },
      // Lookup likes and post children
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'post_id',
          as: 'likes'
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

      // Add bookmark and repost counts
      {
        $addFields: {
          bookmark_count: { $size: { $ifNull: ['$bookmarks', []] } },
          like_count: { $size: { $ifNull: ['$likes', []] } },
          repost_count: {
            $size: {
              $filter: {
                input: { $ifNull: ['$post_children', []] },
                as: 'item',
                cond: { $eq: ['$$item.type', PostType.RePost] }
              }
            }
          },
          quotepost_count: {
            $size: {
              $filter: {
                input: { $ifNull: ['$post_children', []] },
                as: 'item',
                cond: { $eq: ['$$item.type', PostType.QuotePost] }
              }
            }
          }
        }
      },

      // Exclude sensitive user information and post_children from the output
      {
        $project: {
          post_children: 0,
          'user.password': 0,
          'user.verify_email_token': 0,
          'user.forgot_password_token': 0,
          'user.post_circle': 0,
          'user.date_of_birth': 0
        }
      },

      // Pagination
      { $skip: limit * (page - 1) },
      { $limit: limit }
    ]
  }

  private getPostCountPipeline(filter: any, user_id: string) {
    return [
      // Match posts based on the provided filter
      { $match: filter },

      // Lookup user info by user_id
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },

      // Unwind to deconstruct the user array
      { $unwind: '$user' },

      // Match posts based on audience settings and user post circle
      {
        $match: {
          $or: [
            { audience: 0 },
            {
              $and: [{ audience: 1 }, { 'user.post_circle': { $in: [new ObjectId(user_id)] } }]
            }
          ]
        }
      },

      // Count total number of matched posts
      { $count: 'total' }
    ]
  }

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
      databaseService.posts.aggregate(this.getPostsPipeline(filter, user_id, limit, page)).toArray(),
      databaseService.posts.aggregate(this.getPostCountPipeline(filter, user_id)).toArray()
    ])

    return {
      posts,
      total: total[0]?.total || 0
    }
  }
}

const searchService = new SearchService()
export default searchService
