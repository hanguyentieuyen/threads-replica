import { PostAudience, PostType } from '~/constants/enum'
import { Media } from '../media.model'
import { ParamsDictionary, Query } from 'express-serve-static-core'

export interface PostReqBody {
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface Pagination {
  limit: string
  page: string
}

export interface PostParam extends ParamsDictionary {
  post_id: string
}

export interface PostQuery extends Query {
  post_type: string
}
