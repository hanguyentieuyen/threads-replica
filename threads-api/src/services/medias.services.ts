import { Request } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR } from '~/constants/fileDir'
import { uploadFileS3 } from '~/utils/aws-s3'
import { fileImageParser, fileVideoParser, getNameFromFullname } from '~/utils/fileparser'
import fsPromise from 'fs/promises'
import { MediaType } from '~/constants/enum'
import sharp from 'sharp'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

class MediasService {
  async uploadImage(req: Request) {
    const mime = (await import('mime')).default // common js
    const files = await fileImageParser(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)

        // Process the image
        await sharp(file.filepath).jpeg().toFile(newPath)

        const fileUploadS3 = await uploadFileS3({
          fileName: `images/${newFullFileName}`,
          filePath: newPath,
          contentType: mime.getType(newPath) as string
        })
        // Safely attempt to delete the files
        await Promise.allSettled([
          fsPromise.unlink(file.filepath), // Temporary file
          fsPromise.unlink(newPath) // Processed file
        ])
        return {
          url: (fileUploadS3 as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const mime = (await import('mime')).default
    const files = await fileVideoParser(req)
    const result = await Promise.all(
      files.map(async (file) => {
        const fileUploadS3 = await uploadFileS3({
          fileName: `videos/${file.newFilename}`,
          filePath: file.filepath,
          contentType: mime.getType(file.filepath) as string
        })
        fsPromise.unlink(file.filepath)
        return {
          url: fileUploadS3.Location as string,
          type: MediaType.Video
        }
      })
    )

    return result
  }
}

const mediasService = new MediasService()
export default mediasService
