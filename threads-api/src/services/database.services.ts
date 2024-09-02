import { Collection, Db, MongoClient } from 'mongodb'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { envConfig } from '~/utils/config'
import User from '~/models/schemas/User.schema'
import Follower from '~/models/schemas/Follow.schema'
import Like from '~/models/schemas/Like.schema'
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

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }

  get follows(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowsCollection)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection)
  }
}

const databaseService = new DatabaseService()

export default databaseService
