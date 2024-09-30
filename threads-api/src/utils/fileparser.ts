import { Request } from 'express'
import { File } from 'formidable'
import { UPLOAD_IMAGE_TEMP_DIR } from '~/constants/fileDir'
import fs from 'fs'

export const createUploadFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // allow to create nested folder
      })
    }
  })
}

export const getNameFromFullname = (fileName: string) => {
  return fileName.split('.').shift()
}

export const fileImageParser = async (req: Request) => {
  const formidable = (await import('formidable')).default
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFields: 4,
    keepExtensions: true,
    maxFiles: 300 * 1024, //  300kb each file
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, mimetype }) {
      const isValid = name === 'image' && Boolean(mimetype?.includes('image/'))
      return isValid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is empty'))
      }
      resolve(files.images as File[])
    })
  })
}
