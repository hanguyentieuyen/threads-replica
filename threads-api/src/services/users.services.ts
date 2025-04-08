/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { UpdateMyProfileReqBody } from '~/models/requestType/User.requests'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error.model'
import { HTTP_STATUS } from '~/constants/httpStatus'
import Follow from '~/models/follow.model'

class UsersService {
  async checkUsernameExist(username: string) {
    const user = await databaseService.users.findOne({ username })
    return Boolean(user)
  }

  async getMyProfile(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          verify_email_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async updateMyProfile({ user_id, payload }: { user_id: string; payload: UpdateMyProfileReqBody }) {
    const formatPayload = payload.date_of_birth
      ? { ...payload, date_of_birth: new Date(payload.date_of_birth) }
      : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...(formatPayload as UpdateMyProfileReqBody & { date_of_birth?: Date })
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after', // return new document after update
        projection: {
          password: 0,
          verify_email_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }

  async getUserProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username: username },
      {
        projection: {
          password: 0,
          verify_email_token: 0,
          forgot_password_token: 0,
          created_at: 0
        }
      }
    )
    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }

  async follow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await databaseService.follows.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    if (follower === null) {
      await databaseService.follows.insertOne(
        new Follow({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
      return {
        message: USERS_MESSAGES.FOLLOW_SUCCESS
      }
    }

    return { message: USERS_MESSAGES.FOLLOWED }
  }

  async unfollow({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
    const follower = await databaseService.follows.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })

    if (follower === null) {
      return {
        message: USERS_MESSAGES.ALREADY_UNFOLLOWED
      }
    }

    await databaseService.follows.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return { message: USERS_MESSAGES.UNFOLLOWED_SUCCESS }
  }

  async getUserFollowers({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const userFollowers = await databaseService.follows
      .aggregate([
        // filter follow record by followed_user_id
        { $match: { followed_user_id: new ObjectId(user_id) } },
        // Join collection users to get user infor of followers
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'followerDetails'
          }
        },
        // Unwind the array of followers
        { $unwind: '$followerDetails' },
        // Get nesscessary properties of user information
        {
          $project: {
            _id: 0,
            id: '$followerDetails._id',
            name: '$followerDetails.name',
            username: '$followerDetails.username',
            avatar: '$followerDetails.avatar',
            bio: '$followerDetails.bio'
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()

    const total = await databaseService.follows.countDocuments({
      user_id: new ObjectId(user_id)
    })

    return { userFollowers, total }
  }

  async getUserFollowing({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const userFollowing = await databaseService.follows
      .aggregate([
        // filter follow record by user_id
        { $match: { user_id: new ObjectId(user_id) } },
        // Join collection users to get user infor of followers
        {
          $lookup: {
            from: 'users',
            localField: 'followed_user_id',
            foreignField: '_id',
            as: 'followingDetails'
          }
        },
        // // Unwind the array of followers
        { $unwind: '$followingDetails' },
        // Get nesscessary properties of user information
        {
          $project: {
            _id: 0,
            id: '$followingDetails._id',
            name: '$followingDetails.name',
            username: '$followingDetails.username',
            avatar: '$followingDetails.avatar',
            bio: '$followingDetails.bio'
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseService.follows.countDocuments({
      user_id: new ObjectId(user_id)
    })

    return { userFollowing, total }
  }

  async getUserBookmarks({ user_id, limit, page }: { user_id: string; limit: number; page: number }) {
    const userBookmarks = await databaseService.postBookmarks
      .aggregate([
        // filter post record by user bookmark posts
        { $match: { user_id: new ObjectId(user_id) } },
        {
          $lookup: {
            from: 'posts',
            localField: 'post_id',
            foreignField: '_id',
            as: 'postDetails'
          }
        },
        { $unwind: '$postDetails' },
        {
          $project: {
            _id: 0,
            id: '$postDetails._id',
            user_id: '$postDetails.user_id',
            type: '$postDetails.type',
            audience: '$postDetails.audience',
            content: '$postDetails.content',
            parent_id: '$postDetails.parent_id',
            hashtags: '$postDetails.hashtags',
            mentions: '$postDetails.mentions',
            medias: '$postDetails.medias',
            created_at: '$postDetails.created_at',
            updated_at: '$postDetails.updated_at'
          }
        },
        {
          $skip: limit * (page - 1)
        },
        {
          $limit: limit
        }
      ])
      .toArray()
    const total = await databaseService.postBookmarks.countDocuments({
      user_id: new ObjectId(user_id)
    })

    return { userBookmarks, total }
  }

  async searchUsers({ username, limit, page }: { username: string; limit: number; page: number }) {
    const regex = new RegExp(username, 'i')
    const users = await databaseService.users
      .find({ username: regex })
      .skip(limit * (page - 1))
      .limit(limit)
      .project({
        date_of_birth: 0,
        password: 0,
        verify_email_token: 0,
        forgot_password_token: 0,
        verify: 0,
        post_circle: 0,
        created_at: 0,
        updated_at: 0
      })
      .toArray()

    if (users === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const total = await databaseService.users.countDocuments({ username: regex })

    return { users, total }
  }
}

const usersService = new UsersService()
export default usersService
