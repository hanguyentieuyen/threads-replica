/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

export const defaultConstants = {
  page: 1,
  limit: 10
}

export const apiEndpoints = {
  baseUrl: import.meta.env.VITE_BASE_URL,
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register",
    refreshToken: "/auth/refresh-token",
    forgotPassword: "/auth/forgot-password",
    verifyForgotPassword: "/auth/verify-forgot-password",
    resetPassword: "/auth/reset-password",
    changePassword: "/auth/change-password",
    verifyEmail: "/auth/verify-email",
    loginWithGoogle: "/auth/oauth/google"
  },
  user: {
    checkExistUsername: "/users/check-username",
    search: "/users",
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
