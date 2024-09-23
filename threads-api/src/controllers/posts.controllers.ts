import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POSTS_MESSAGES } from '~/constants/messages'
import { PostReqBody } from '~/models/requestType/Post.requests'
import { TokenPayload } from '~/models/requestType/User.requests'
import postsService from '~/services/posts.services'

export const createPostController = async (req: Request<ParamsDictionary, any, PostReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const data = await postsService.createPost({ user_id, body: req.body })
  return res.json({
    message: POSTS_MESSAGES.CREATE_POST_SUCCESS,
    data: data
  })
}

export const getPostController = async () => {}

export const getNewPostsController = async () => {}
