import { Query } from 'express-serve-static-core'

export interface SearchHashTagsQuery extends Query {
  search: string
}

export interface HashTagReqBody {
  hashtag: string
}
