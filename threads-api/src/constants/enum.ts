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
