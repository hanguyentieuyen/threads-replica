export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_STRING: 'Name must be string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_STRING: 'Password must be string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 4 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 4 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRING:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login success',
  LOGOUT_SUCCESS: 'Logout success',
  REGISTER_SUCCESS: 'Register success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  EMAIL_VERIFY_SUCCESS: 'Email verify success',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_ME_SUCCESS: 'Get my profile success',
  USER_NOT_VERIFIED: 'User not verified',
  BIO_MUST_BE_STRING: 'Bio must be string',
  BIO_LENGTH: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_STRING: 'Location must be string',
  LOCATION_LENGTH: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_STRING: 'Website must be string',
  WEBSITE_LENGTH: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_STRING: 'Username must be string',
  USERNAME_EXITSED: 'Username exised',
  USERNAME_INVALID:
    'Username must be 4-15 characters long and contain only letters, numbers, underscores, not only numbers',
  IMAGE_MUST_BE_STRING: 'Image must be string',
  IMAGE_LENGTH: 'Image length must be from 1 to 200',
  UPDATE_ME_SUCCESS: 'Update my profile success',
  GET_PROFILE_SUCCESS: 'Get profile success',
  INVALID_USER_ID: 'Invalid followed user id',
  FOLLOW_SUCCESS: 'Follow success',
  FOLLOWED: 'Followed',
  ALREADY_UNFOLLOWED: 'Already unfollowed',
  UNFOLLOWED_SUCCESS: 'Unfollowed success',
  GET_USER_FOLLOWERS_SUCCESS: 'Get user followers successfully',
  GET_USER_FOLLOWING_SUCCESS: 'Get user following successfully',
  GET_USER_BOOKMARKS_SUCCESS: 'Get user bookmark successfully',
  LIKE_SUCCESS: 'Like success',
  LIKED: 'Liked',
  UNLIKED_SUCCESS: 'Unlike success',
  ALREADY_UNLIKED: 'Already unliked',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  OLD_PASSWORD_NOT_MATCH: 'Old password not match',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_SUCCESS: 'Upload success',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  GET_VIDEO_STATUS_SUCCESS: 'Get video status success'
} as const

export const POSTS_MESSAGES = {
  INVALID_POST: 'Invalid post',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_POST_ID: 'Parent id must be a valid post id',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a none empty string',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  CREATE_POST_SUCCESS: 'Create post success',
  INVALID_POST_ID: 'Invalid post id',
  POST_NOT_FOUND: 'Post not found',
  GET_POST_SUCCESS: 'Get post success',
  POST_IS_NOT_PUBLIC: 'Post is not public',
  INVALID_TYPE: 'Ivalid type',
  SEARCH_POST_SUCCESS: 'Search posts successfully',
  SEARCH_CONTENT_MUST_BE_STRING: 'Search content must be string',
  MEDIA_TYPE_MUST_BE_ONE_OF_VALUES: 'Media type must be one of values',
  PEOPLE_FOLLOW_MUST_BE_0_OR_1: 'Peole follow must be 0 or 1',
  CREATE_COMMENT_SUCCESS: 'Create comment success',
  CREATE_COMMENT_FAILED: 'Create comment failed'
} as const

export const COMMENTS_MESSAGES = {
  INVALID_COMMENT: 'Invalid comment',
  COMMENT_ID_IS_REQUIRED: 'Comment ID is required'
} as const

export const BOOKMARKS_MESSAGES = {
  BOOKMARK_SUCCESS: 'Bookmark success',
  UNBOOKMARK_SUCCESS: 'Unbookmark success'
} as const

export const LIKES_MESSAGES = {
  LIKE_SUCCESS: 'Like success',
  UNLIKE_SUCCESS: 'Unlike success'
} as const

export const HASHTAGS_MESSAGES = {
  SEARCH_CONTENT_MUST_BE_STRING: 'Search content must be string',
  GET_HASHTAG_SUCCESS: 'Get hashtags successfully',
  GET_HASHTAG_FAILED: 'Get hashtags failed',
  HASHTAG_MUST_BE_STRING: 'Hashtag must be string',
  HASHTAG_NOT_FOUND: 'Hashtag not found',
  CREATE_HASHTAG_SUCCESS: 'Create hashtag success',
  CREATE_HASHTAG_FAILED: 'Create hashtag failed'
} as const
