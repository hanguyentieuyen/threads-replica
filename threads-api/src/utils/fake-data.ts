import { faker } from '@faker-js/faker'
import { MediaType, PostAudience, PostType } from '~/constants/enum'
import { PostReqBody } from '~/models/requestType/Post.requests'

const randomPosts = () => {
  const post: PostReqBody = {
    type: PostType.Post,
    audience: PostAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    hashtags: ['Javascript', 'TypeScript', 'NodeJS', 'ReactJS', 'NextJS', 'MongoDB'],
    medias: [
      {
        type: MediaType.Image,
        url: faker.image.url()
      }
    ],
    mentions: [],
    parent_id: null
  }
  return post
}
