import { NextFunction, Request, Response } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_IMAGE_TEMP_DIR } from '~/constants/fileDir'
import path from 'path'

export const serveImageController = async (req: Request, res: Response, nex: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    console.log(err)
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
