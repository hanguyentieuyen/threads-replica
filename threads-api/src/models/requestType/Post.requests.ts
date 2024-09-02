import { PostAudience, PostType } from '~/constants/enum'
import { Media } from '../schemas/Media.schema'

export interface PostReqBody {
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}
