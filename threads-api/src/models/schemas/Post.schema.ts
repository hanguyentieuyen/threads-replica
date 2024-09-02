import { ObjectId } from 'mongodb'
import { PostAudience, PostType } from '~/constants/enum'
import { Media } from './Media.schema'

interface PostConstructor {
  _id?: ObjectId
  user_id: ObjectId
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | string //  chỉ null khi post gốc
  hashtags: string[]
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}

export default class Post {
  _id?: ObjectId
  user_id: ObjectId
  type: PostType
  audience: PostAudience
  content: string
  parent_id: null | ObjectId
  hashtags: ObjectId[]
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    user_id,
    audience,
    content,
    hashtags,
    medias,
    mentions,
    parent_id,
    type,
    user_views,
    guest_views,
    created_at,
    updated_at
  }: PostConstructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    ;(this.audience = audience), (this.content = content)
    this.hashtags = hashtags.map((item) => new ObjectId(item))
    this.medias = medias
    this.mentions = mentions.map((item) => new ObjectId(item))
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.type = type
    this.user_views = user_views || 0
    this.guest_views = guest_views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
