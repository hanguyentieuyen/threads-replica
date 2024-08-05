import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'

export const loginController = (req: Request, res: Response) => {
  const user = req.body as User
  const userId = user._id as ObjectId
  return res.status(400).json({
    message: 'Login failed'
  })
}
