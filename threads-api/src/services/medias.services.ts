import { Request } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR } from '~/constants/fileDir'
import { uploadFileS3 } from '~/utils/aws-s3'
import { fileImageParser, getNameFromFullname } from '~/utils/fileparser'
import fsPromise from 'fs/promises'
import { MediaType } from '~/constants/enum'
import sharp from 'sharp'

class MediasService {
  async uploadImage(req: Request) {
    const mime = (await import('mime')).default // common js
    const files = await fileImageParser(req)
    const result = files.map(async (file) => {
      const newName = getNameFromFullname(file.newFilename)
      const newFullFileName = `${newName}.jpg`
      const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
      await sharp(file.filepath).jpeg().toFile(newPath)
      const fileUploadS3 = await uploadFileS3({
        fileName: `images/${newFullFileName}`,
        filePath: newPath,
        contentType: mime.getType(newPath) as string
      })
      await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
      return {
        url: fileUploadS3.Location,
        type: MediaType.Image
      }
    })
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
