/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */
import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { PostType } from '~/constants/enum'
import { BOOKMARKS_MESSAGES, LIKES_MESSAGES, POSTS_MESSAGES } from '~/constants/messages'
import { Pagination, PostParam, PostQuery, PostReqBody } from '~/models/requestType/Post.requests'
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

export const getPostController = async (req: Request, res: Response) => {
  const { post_id } = req.validateData
  const data = await postsService.getPostDetail(post_id)
  return res.json({
    message: POSTS_MESSAGES.GET_POST_SUCCESS,
    data: data
  })
}

export const getPostsController = async (req: Request<ParamsDictionary, any, any, Pagination>, res: Response) => {
  const user_id = req.decodedAuthorization.user_id
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await postsService.getPosts({
    user_id,
    limit,
    page
  })
  return res.json({
    message: POSTS_MESSAGES.GET_POST_SUCCESS,
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      posts: data.posts
    }
  })
}

export const getPostChildrenController = async (req: Request<PostParam, any, any, PostQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const post_type = Number(req.query.post_type) as PostType
  const user_id = req.decodedAuthorization?.user_id
  const { posts, total } = await postsService.getPostChildren({
    post_id: req.params.post_id,
    post_type,
    limit,
    page,
    user_id
  })
  return res.json({
    message: POSTS_MESSAGES.GET_POST_SUCCESS,
    data: {
      posts,
      post_type,
      limit,
      page,
      total_page: Math.ceil(total / limit)
    }
  })
}

export const bookmarkPostController = async (req: Request<ParamsDictionary, any, PostParam>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { post_id } = req.validateData
  const data = await postsService.bookmarkPost(user_id, post_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.BOOKMARK_SUCCESS,
    data
  })
}

export const unbookmarkPostController = async (req: Request<ParamsDictionary, any, PostParam>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { post_id } = req.validateData
  const data = await postsService.unbookmarkPost(user_id, post_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.UNBOOKMARK_SUCCESS,
    data
  })
}

export const likePostController = async (req: Request<ParamsDictionary, any, PostParam>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { post_id } = req.validateData
  const data = await postsService.likePost(user_id, post_id)
  return res.json({
    message: LIKES_MESSAGES.LIKE_SUCCESS,
    data
  })
}

export const unlikePostController = async (req: Request<ParamsDictionary, any, PostParam>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { post_id } = req.validateData
  const data = await postsService.unlikePost(user_id, post_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKE_SUCCESS,
    data
  })
}
