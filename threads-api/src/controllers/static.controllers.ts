import { NextFunction, Request, Response } from 'express'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/fileDir'
import path from 'path'
import fs from 'fs'
import { HTTP_STATUS } from '~/constants/httpStatus'
import mime from 'mime'

export const serveImageController = async (req: Request, res: Response, nex: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    console.log(err)
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // size bytes
  const videoSize = fs.statSync(videoPath).size
  // chunk size
  const chunkSize = 10 * 10 ** 6 // 1Mb
  // get start value from header range, ex: bytes=104567-
  const start = Number(range.replace(/\D/g, ''))
  // get end value, If the capacity is exceeded, the value will be videoSize
  const end = Math.min(start + chunkSize, videoSize - 1)

  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Range': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
