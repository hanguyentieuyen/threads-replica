/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { S3 } from '@aws-sdk/client-s3'
import { envConfig } from './config'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'

const awsS3 = new S3({
  region: envConfig.awsRegion,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey,
    accessKeyId: envConfig.awsAccessKeyId
  }
})

// Check connect to s3 bucket
//awsS3.listBuckets({}).then((data) => console.log(data))
export const uploadFileS3 = ({
  fileName,
  filePath,
  contentType
}: {
  fileName: string
  filePath: string
  contentType: string
}) => {
  const parallelUploadS3 = new Upload({
    client: awsS3,
    params: {
      Bucket: envConfig.s3BucketName,
      Key: fileName,
      Body: fs.readFileSync(filePath),
      ContentType: contentType
    }
  })
  return parallelUploadS3.done()
}
