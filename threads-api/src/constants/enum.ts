/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

export enum UserVerifyStatus {
  Unverified, // 0
  Verified
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum PostType {
  Post,
  RePost,
  QuotePost
}

export enum PostAudience {
  Everyone,
  FewSomeone
}

export enum MediaType {
  Image = 'image',
  Video = 'video'
}

export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}

export enum PeopleFollow {
  Anyone = '0',
  Following = '1'
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow'
}
