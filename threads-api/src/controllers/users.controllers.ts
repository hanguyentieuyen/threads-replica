import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  console.log(req)
  const user = req.body as User
  const userId = user._id as ObjectId
  const result = await usersService.login({ user_id: userId.toString(), verify: user.verify })
  return res.status(400).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
