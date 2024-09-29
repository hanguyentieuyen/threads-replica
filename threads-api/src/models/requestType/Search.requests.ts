import { Query } from 'express-serve-static-core'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'

export interface SearchQuery extends Query {
  content: string
  media_type: MediaTypeQuery
  people_follow: PeopleFollow
}
