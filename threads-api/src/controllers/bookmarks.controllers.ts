import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOKMARKS_MESSAGES } from '~/constants/messages'
import { BookmarkReqBody } from '~/models/requestType/Bookmark.requests'
import { TokenPayload } from '~/models/requestType/User.requests'
import bookmarksService from '~/services/bookmarks.services'

export const bookmarksController = async (req: Request<ParamsDictionary, any, BookmarkReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const result = await bookmarksService.bookmarks(user_id, req.body.post_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.BOOKMARK_SUCCESS,
    result
  })
}

export const unbookmarksController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const result = await bookmarksService.unbookmarks(user_id, req.params.post_id)
  return res.json({
    message: BOOKMARKS_MESSAGES.UNBOOKMARK_SUCCESS,
    result
  })
}
