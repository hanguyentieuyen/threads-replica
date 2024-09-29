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
  RePost
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
