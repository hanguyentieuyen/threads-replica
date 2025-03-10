import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import RefreshToken from '~/models/refreshToken.model'
import { envConfig } from '~/utils/config'
import User from '~/models/user.model'
import Follower from '~/models/follow.model'
import Post from '~/models/post.model'
import PostLike from '~/models/postLike.model'
import PostBookmark from '~/models/postBookmark.model'
import HashTag from '~/models/hashtag.model'
import Comment from '~/models/comment.model'
import CommentLike from '~/models/commentLike.model'
import Notification from '~/models/notification.model'

config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@threads-replica.ugxgau4.mongodb.net/?retryWrites=true&w=majority&appName=Threads-Replica`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your database. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error: ', error)
      throw error
    }
  }
  async indexPosts() {
    const exists = await this.posts.indexExists(['content_text'])
    if (!exists) {
      this.posts.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }

  get follows(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowsCollection)
  }

  get hashtags(): Collection<HashTag> {
    return this.db.collection(envConfig.dbHashTagsCollection)
  }

  get posts(): Collection<Post> {
    return this.db.collection(envConfig.dbPostsCollection)
  }

  get postLikes(): Collection<PostLike> {
    return this.db.collection(envConfig.dbPostLikesCollection)
  }

  get postBookmarks(): Collection<PostBookmark> {
    return this.db.collection(envConfig.dbPostBookmarksCollection)
  }

  get comments(): Collection<Comment> {
    return this.db.collection(envConfig.dbCommentsCollection)
  }

  get commentLikes(): Collection<CommentLike> {
    return this.db.collection(envConfig.dbCommentLikesCollection)
  }

  get notifications(): Collection<Notification> {
    return this.db.collection(envConfig.dbNotificationsCollection)
  }
}

const databaseService = new DatabaseService()

export default databaseService
