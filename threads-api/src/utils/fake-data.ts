/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import { MediaType, PostAudience, PostType, UserVerifyStatus } from '~/constants/enum'
import { PostReqBody } from '~/models/requestType/Post.requests'
import { RegisterReqBody } from '~/models/requestType/User.requests'
import User from '~/models/user.model'
import databaseService from '~/services/database.services'
import { hashPassword } from './hash'
import Post from '~/models/post.model'
import Follow from '~/models/follow.model'
import HashTag from '~/models/hashtag.model'

const MYID = new ObjectId('6713e74880a37c56378c90eb')
const PASSWORD = 'Yen@123'
const USER_COUNT = 5
const DEFAULT_HASHTAGS = ['NodeJS', 'MongoDB', 'NextJS', 'Swagger', 'Docker', 'ReactJS']

const createRandomUser = (): RegisterReqBody => ({
  name: faker.internet.displayName(),
  username: `${faker.internet.userName()}_${faker.string.uuid().slice(0, 8)}`,
  email: faker.internet.email(),
  password: PASSWORD,
  confirm_password: PASSWORD,
  date_of_birth: faker.date.past().toISOString()
})

const createRandomPost = (): PostReqBody => ({
  type: PostType.Post,
  audience: PostAudience.Everyone,
  content: faker.lorem.paragraph({ min: 10, max: 160 }),
  hashtags: DEFAULT_HASHTAGS,
  medias: [
    {
      type: MediaType.Image,
      url: faker.image.url()
    }
  ],
  mentions: [],
  parent_id: null
})

const followUsers = async (userId: ObjectId, followedUserIds: ObjectId[]): Promise<void> => {
  console.log('Starting to follow users...')
  await Promise.all(
    followedUserIds.map((followedUserId) =>
      databaseService.follows.insertOne(
        new Follow({
          user_id: userId,
          followed_user_id: followedUserId
        })
      )
    )
  )
  console.log(`Followed ${followedUserIds.length} users.`)
}

const ensureHashtagsExist = async (hashtags: string[]): Promise<ObjectId[]> => {
  const hashtagDocuments = await Promise.all(
    hashtags.map(async (hashtag) => {
      const result = await databaseService.hashtags.findOneAndUpdate(
        { name: hashtag },
        { $setOnInsert: new HashTag({ name: hashtag }) },
        { upsert: true, returnDocument: 'after' }
      )

      if (!result) {
        throw new Error(`Failed to retrieve or create hashtag: ${hashtag}`)
      }

      return { value: result._id }
    })
  )

  // Map the result to extract ObjectId
  return hashtagDocuments.map((doc) => {
    if (!doc.value) {
      throw new Error('Unexpected null value in hashtagDocuments')
    }
    return doc.value
  })
}

// Insert data into database
const insertPost = async (userId: ObjectId, body: PostReqBody): Promise<void> => {
  const hashtags = await ensureHashtagsExist(body.hashtags)
  await databaseService.posts.insertOne(
    new Post({
      ...body,
      hashtags,
      user_id: userId
    })
  )
}

const insertPostsForUsers = async (userIds: ObjectId[]): Promise<void> => {
  console.log('Creating posts...')
  let totalPosts = 0
  await Promise.all(
    userIds.map(async (userId) => {
      await Promise.all([insertPost(userId, createRandomPost()), insertPost(userId, createRandomPost())])
      totalPosts += 2
      console.log(`Created ${totalPosts} posts.`)
    })
  )
}

const insertUsers = async (users: RegisterReqBody[]): Promise<ObjectId[]> => {
  console.log('Creating users...')
  const userIds = await Promise.all(
    users.map(async (user) => {
      const userId = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          _id: userId,
          username: `user${userId.toString()}`,
          password: hashPassword(user.password),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.Verified
        })
      )
      return userId
    })
  )
  console.log(`Created ${userIds.length} users`)
  return userIds
}

const main = async (): Promise<void> => {
  try {
    const users = faker.helpers.multiple(createRandomUser, { count: USER_COUNT })
    const userIds = await insertUsers(users)

    await followUsers(MYID, userIds)
    await insertPostsForUsers(userIds)

    console.log('Data generation complete!')
  } catch (error) {
    console.error('Error during data generation:', error)
  }
}

main()
