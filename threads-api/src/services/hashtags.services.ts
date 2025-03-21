import { ErrorWithStatus } from '~/models/error.model'
import databaseService from './database.services'
import { HASHTAGS_MESSAGES } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/httpStatus'
import HashTag from '~/models/hashtag.model'

class HashTagsService {
  async search({ searchText }: { searchText: string }) {
    let filter = {}
    if (searchText) {
      filter = { name: { $regex: searchText, $options: 'i' } } // search uppercase, lowercase
    }
    const hashtags = await databaseService.hashtags.find(filter).project({ name: 1, _id: 0 }).limit(10).toArray()

    if (hashtags === null || hashtags.length === 0) {
      throw new ErrorWithStatus({
        message: HASHTAGS_MESSAGES.GET_HASHTAG_FAILED,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return hashtags.map((hashtag) => hashtag.name)
  }

  async createHashTag(hashtag: string) {
    const newHashTag = await databaseService.hashtags.findOneAndUpdate(
      { name: hashtag },
      { $setOnInsert: new HashTag({ name: hashtag }) },
      { upsert: true, returnDocument: 'after' }
    )

    if (!newHashTag) {
      throw new ErrorWithStatus({
        message: HASHTAGS_MESSAGES.GET_HASHTAG_FAILED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    return newHashTag
  }
}

const hashTagsService = new HashTagsService()

export default hashTagsService
