const config = {
  baseUrl: "http://localhost:4000/",
  maxSizeUploadAvatar: 1048576, // bytes,
  loginUrl: "/users/login",
  logoutUrl: "/users/logout",
  registerUrl: "/users/register",
  forgotPassword: "/users/forgot-password",
  verifyForgotPassword: "/users/verify-forgot-password",
  resetPassword: "/users/reset-password",
  changePassword: "/users/change-password",
  verifyEmail: "/users/verify-email",
  me: "/users/me",
  users: "/users",
  follow: "/users/follow",
  unfollow: "/users/follow/:user_id",
  refreshTokenUrl: "/refresh-access-token",
  posts: "/posts",
  bookmark: "/bookmark",
  unbookmark: "/bookmark/post",
  like: "/like",
  unlike: "/like/post",
  search: "/search",
  uploadImage: "/medias/upload-image",
  uploadVideo: "/medias/upload-video"
}

export default config
