const config = {
  baseUrl: 'http://localhost:4000/',
  maxSizeUploadAvatar: 1048576, // bytes,
  loginUrl: '/users/login',
  logoutUrl: '/users/logout',
  registerUrl: '/users/register',
  forgotPassword: '/users/forgot-password',
  verifyForgotPassword: '/users/verify-forgot-password',
  resetPassword: '/users/reset-password',
  refreshTokenUrl: 'refresh-access-token',
  verifyEmail: '/users/verify-email'
}

export default config
