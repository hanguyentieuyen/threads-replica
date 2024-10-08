import { config } from 'dotenv'

config()
export const envConfig = {
  dbName: process.env.DB_NAME as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbFollowsCollection: process.env.DB_FOLLOWS_COLLECTION as string,
  dbLikesCollection: process.env.DB_LIKES_COLLECTION as string,
  dbBookmarksCollection: process.env.DB_BOOKMARKS_COLLECTION as string,
  dbPostsCollection: process.env.DB_POSTS_COLLECTION as string,
  dbHashTagsCollection: process.env.DB_HASHTAGS_COLLECTION as string,
  dbRefreshTokensCollection: process.env.DB_REFRESHTOKEN_COLLECTION as string,

  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretVerifyMailToken: process.env.JWT_SECRET_VERIFY_EMAIL_TOKEN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,

  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  passwordSecret: process.env.PASSWORD_SECRET as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,

  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsRegion: process.env.AWS_REGION as string,
  s3BucketName: process.env.S3_BUCKET_NAME as string
}
