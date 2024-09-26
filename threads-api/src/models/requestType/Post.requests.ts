import { PostAudience, PostType } from '~/constants/enum'
import { Media } from '../media.model'

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
