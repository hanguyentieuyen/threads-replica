import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKES_MESSAGES } from '~/constants/messages'
import { LikeReqBody, UnLikeReqBody } from '~/models/requestType/Like.requests'
import { TokenPayload } from '~/models/requestType/User.requests'
import likesService from '~/services/likes.services'

export const likesController = async (req: Request<ParamsDictionary, any, LikeReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const result = await likesService.likes(user_id, req.body.post_id)
  return res.json({
    message: LIKES_MESSAGES.LIKE_SUCCESS,
    result
  })
}

export const unlikesController = async (req: Request<ParamsDictionary, any, UnLikeReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const result = await likesService.unlikes(user_id, req.params.post_id)
  return res.json({
    message: LIKES_MESSAGES.UNLIKE_SUCCESS,
    result
  })
}
