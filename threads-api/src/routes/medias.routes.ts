import { Router } from 'express'
import { uploadImageController } from '~/controllers/medias.controllers'
import { requestHandler } from '~/utils/requestHandler'
import { validateMiddleware } from '~/utils/validateMiddleware'
import { accessTokenValidator } from '~/validations/users.validations'

const mediaRouter = Router()

/**
 * Description: Upload image to AWS S3
 * Path: /upload-image
 * Method: POST
 * Form-data: file
 * Header: { Authorization: Bearer <access_token>}
 */
mediaRouter.post(
  '/upload-image',
  validateMiddleware(accessTokenValidator, 'headers'),
  requestHandler(uploadImageController)
)
export default mediaRouter
