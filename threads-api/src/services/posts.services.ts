import { PostReqBody } from '~/models/requestType/Post.requests'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import Post from '~/models/schemas/Post.schema'

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
}

const postsService = new PostsService()
export default postsService
