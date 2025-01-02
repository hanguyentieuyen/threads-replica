import { ParamsDictionary } from 'express-serve-static-core'

export interface BookmarkReqBody {
  post_id: string
}

export interface UnBookmarkReqBody extends ParamsDictionary {
  post_id: string
}
