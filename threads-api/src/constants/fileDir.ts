import path from 'path'
// const { platform } = process
// console.log('platform: ', platform)

export const toUnixPath = (folderPath: string) => folderPath.replace(/[\\/]+/g, '/').replace(/^([a-zA-Z]+:|\.\/)/, '')

export const UPLOAD_IMAGE_TEMP_DIR = path.resolve('uploads/images/temps')
export const UPLOAD_IMAGE_DIR = path.resolve('uploads/images')
