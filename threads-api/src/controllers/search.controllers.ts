/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POSTS_MESSAGES } from '~/constants/messages'
import { SearchQuery } from '~/models/requestType/Search.requests'
import searchService from '~/services/search.services'
export const searchController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const page = Number(req.query.page)
  const limit = Number(req.query.limit)
  const user_id = req.decodedAuthorization.user_id
  const data = await searchService.search({
    user_id,
    limit,
    page,
    content: req.query.content,
    media_type: req.query.media_type,
    people_follow: req.query.people_follow
  })

  return res.json({
    message: POSTS_MESSAGES.SEARCH_POST_SUCCESS,
    data: {
      limit,
      page,
      total_page: Math.ceil(data.total / limit),
      posts: data.posts
    }
  })
}
