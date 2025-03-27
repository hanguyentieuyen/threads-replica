/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */
import { Query } from 'express-serve-static-core'

export interface SearchHashTagsQuery extends Query {
  search: string
}

export interface HashTagReqBody {
  hashtag: string
}
