const apiEndpoints = {
  baseUrl: "http://localhost:4000/",
  auth: {
    login: "/users/login",
    logout: "/users/logout",
    register: "/users/register",
    refreshToken: "/refresh-access-token",
    forgotPassword: "/users/forgot-password",
    verifyForgotPassword: "/users/verify-forgot-password",
    resetPassword: "/users/reset-password",
    changePassword: "/users/change-password",
    verifyEmail: "/users/verify-email",
    loginWithGoogle: "/users/oauth/google"
  },
  user: {
    getMyProfile: "/users/me",
    getUserProfile: (username: string) => `/users/${username}`,
    follow: "/users/follow",
    unfollow: (id: string) => `/users/follow/${id}`,
    getUserFollowers: (id: string) => `/users/${id}/followers`,
    getUserFollowing: (id: string) => `/users/${id}/following`
  },
  post: {
    get: "/posts",
    detail: (id: string) => `/posts/${id}`,
    create: "/posts",
    like: (id: string) => `/posts/${id}/like`,
    unlike: (id: string) => `/posts/${id}/like`,
    bookmark: (id: string) => `/posts/${id}/bookmark`,
    unbookmark: (id: string) => `/posts/${id}/bookmark`
  },
  comment: {
    get: (id: string) => `/posts/${id}/comments`,
    create: "/comments",
    update: (id: string) => `/comments/${id}`,
    delete: (id: string) => `/comments/${id}`,
    like: (id: string) => `/comments/${id}/like`,
    unlike: (id: string) => `/comments/${id}/like`
  },
  hashtag: {
    search: "/hashtags",
    create: "/hashtags"
  },
  media: {
    uploadImage: "/medias/upload-image",
    uploadVideo: "/medias/upload-video"
  },
  search: {
    searchPost: "/search"
  }
}
export default apiEndpoints
