import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/error.model'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  ForgotPasswordReqBody,
  GetUserFollowersReqBody,
  GetUserFollowingReqBody,
  GetUserProfileReqBody,
  LoginReqBody,
  LogoutReqBody,
  RefreshTokenReqBody,
  RegisterReqBody,
  ResetPasswordReqBody,
  TokenPayload,
  UnFollowReqBody,
  UpdateMyProfileReqBody,
  VerifyEmailTokenReqBody,
  VerifyForgotPasswordReqBody
} from '~/models/requestType/User.requests'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { envConfig } from '~/utils/config'
import { hashPassword } from '~/utils/hash'
import { verifyToken } from '~/utils/jwt'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const { email, password } = req.validateData
  const hashedPassword = hashPassword(password)

  // Check if the user exists in the database
  const user = await usersService.getUserByEmailPassword({ email, hashedPassword })
  if (user === null) {
    throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
  }
  const userId = user._id as ObjectId
  const data = await usersService.login({ user_id: userId.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data
  })
}

export const oauthController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await usersService.oauth(code as string)
  const urlRedirect = `${envConfig.clientRedirectCallback}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&verify=${result.verify}`
  return res.redirect(urlRedirect)
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  // Check if the email exists in the database
  const isExistEmail = await usersService.checkEmailExist(req.validateData.email)
  if (isExistEmail) {
    throw new Error('Email already exists')
  }
  const data = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailTokenReqBody>,
  res: Response
) => {
  const { verify_email_token } = req.validateData
  // decode verify_email_token
  try {
    const decodedVerifyEmailToken = await verifyToken({
      token: verify_email_token,
      secretOrPublicKey: envConfig.jwtSecretVerifyMailToken
    })

    ;(req as Request).decodedVerifyEmailToken = decodedVerifyEmailToken
  } catch (error) {
    throw new ErrorWithStatus({
      message: capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  const { user_id } = req.decodedVerifyEmailToken as TokenPayload

  const user = await usersService.getUserById(user_id)
  // Case 0: user not found
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  // Case 1: email is verified
  if (user.verify_email_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  // Case 2: email is not verified
  const data = usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    data
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  const data = await usersService.logout(refresh_token)
  return res.json(data)
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.validateData

  try {
    //verify token and check its existence in the database
    const [decodedRefreshToken, existedRefreshToken] = await Promise.all([
      verifyToken({ token: refresh_token, secretOrPublicKey: envConfig.jwtSecretRefreshToken }),
      databaseService.refreshTokens.findOne({ token: refresh_token })
    ])

    if (!existedRefreshToken) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const { user_id, verify, exp } = decodedRefreshToken

    const data = await usersService.refreshToken({ user_id, refresh_token, verify, exp })
    return res.json({
      message: USERS_MESSAGES.REFRESH_TOKEN_SUCCESS,
      data
    })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    throw error
  }
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordReqBody>,
  res: Response
) => {
  const user = await usersService.getUserByEmail({ email: req.validateData.email })
  if (user === null) {
    throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
  }
  const data = await usersService.forgotPassword({
    user_id: (user._id as ObjectId).toString(),
    verify: user.verify,
    email: user.email
  })
  return res.json(data)
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordReqBody>,
  res: Response
) => {
  const { forgot_password_token } = req.validateData
  try {
    // decode
    const decodedForgotPasswordToken = await verifyToken({
      token: forgot_password_token,
      secretOrPublicKey: envConfig.jwtSecretForgotPasswordToken
    })

    const { user_id } = decodedForgotPasswordToken
    const user = await usersService.getUserById(user_id)
    // check user exist
    if (user === null) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    // compare token value on db and token value from req.body
    if (user.forgot_password_token !== req.body.forgot_password_token) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    // override decodedForgotPasswordToken of req
    req.decodedForgotPasswordToken = decodedForgotPasswordToken
    return res.json({
      message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
    })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
  }
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordReqBody>,
  res: Response
) => {
  const { forgot_password_token, password } = req.validateData

  if (!forgot_password_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }

  try {
    // Verify the forgot password token
    const decodedToken = await verifyToken({
      token: forgot_password_token,
      secretOrPublicKey: envConfig.jwtSecretForgotPasswordToken as string
    })

    const { user_id } = decodedToken

    const user = await usersService.getUserById(user_id)
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    // Validate the token matches the stored user token
    if (user.forgot_password_token !== forgot_password_token) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    req.decodedForgotPasswordToken = decodedToken // Store decoded token in request object
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    throw error
  }

  // Reset the user's password
  const { user_id } = req.decodedForgotPasswordToken as TokenPayload
  const data = await usersService.resetPassword({ user_id, password })

  return res.json(data)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response
) => {
  const { user_id } = req.decodedAuthorization
  const { old_password, password } = req.validateData
  // Check if user exists
  const user = await usersService.getUserById(user_id)
  if (!user) {
    throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
  }
  // Check password on db is match with old password
  const { password: currentPassword } = user
  const isMatch = hashPassword(old_password) === currentPassword
  if (!isMatch) {
    throw new Error(USERS_MESSAGES.OLD_PASSWORD_NOT_MATCH)
  }
  const data = await usersService.changePassword({ user_id, password })
  return res.json(data)
}

export const getMyProfileController = async (req: Request, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload

  const myProfileData = await usersService.getMyProfile(user_id)
  return res.json({
    data: myProfileData,
    message: USERS_MESSAGES.GET_ME_SUCCESS
  })
}

export const updateMyProfileController = async (
  req: Request<ParamsDictionary, any, UpdateMyProfileReqBody>,
  res: Response
) => {
  const payload = req.body
  const { user_id } = req.decodedAuthorization as TokenPayload
  const userData = await usersService.updateMyProfile({ user_id, payload })
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    data: userData
  })
}

export const getUserProfileController = async (req: Request<GetUserProfileReqBody>, res: Response) => {
  const { username } = req.params
  const userData = await usersService.getUserProfile(username)
  return res.json({
    data: userData,
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS
  })
}

export const followController = async (req: Request<ParamsDictionary, any, FollowReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { followed_user_id } = req.validateData
  const data = await usersService.follow({ user_id, followed_user_id })
  return res.json(data)
}

export const unFollowController = async (req: Request<UnFollowReqBody>, res: Response) => {
  const { user_id } = req.decodedAuthorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const data = await usersService.unfollow({ user_id, followed_user_id })
  return res.json(data)
}

export const getUserFollowersController = async (req: Request<GetUserFollowersReqBody>, res: Response) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.getUserFollowers({ user_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      user_followers: data.userFollowers
    },
    message: USERS_MESSAGES.GET_USER_FOLLOWERS_SUCCESS
  })
}

export const getUserFollowingController = async (req: Request<GetUserFollowingReqBody>, res: Response) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.getUserFollowing({ user_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      user_following: data.userFollowing
    },
    message: USERS_MESSAGES.GET_USER_FOLLOWING_SUCCESS
  })
}

export const getUserBookmarksController = async (req: Request<GetUserFollowingReqBody>, res: Response) => {
  const { user_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const data = await usersService.getUserBookmarks({ user_id, limit, page })
  return res.json({
    data: {
      page,
      limit,
      total_page: Math.ceil(data.total / limit),
      user_bookmark_posts: data.userBookmarks
    },
    message: USERS_MESSAGES.GET_USER_BOOKMARKS_SUCCESS
  })
}
