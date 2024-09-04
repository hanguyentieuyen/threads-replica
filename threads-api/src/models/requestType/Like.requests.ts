import { ParamsDictionary } from 'express-serve-static-core'

export interface LikeReqBody {
  post_id: string
}

export interface UnLikeReqBody extends ParamsDictionary {
  liked_post_id: string
}
