import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { HASHTAGS_MESSAGES } from '~/constants/messages'
import { HashTagReqBody, SearchHashTagsQuery } from '~/models/requestType/HashTags.requests'
import hashTagsService from '~/services/hashtags.services'

export const searchHashTagsController = async (
  req: Request<ParamsDictionary, any, any, SearchHashTagsQuery>,
  res: Response
) => {
  const data = await hashTagsService.search({
    searchText: req.query.search
  })

  return res.json({
    message: HASHTAGS_MESSAGES.GET_HASHTAG_SUCCESS,
    data
  })
}

export const createHashTagController = async (req: Request<ParamsDictionary, any, HashTagReqBody>, res: Response) => {
  const data = await hashTagsService.createHashTag(req.body.hashtag)
  return res.json({ data })
}
