import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { envConfig } from './config'
import fs from 'fs'
import path from 'path'

type sendEmailCommandType = {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  body: string
  subject: string
  replyToAddresses?: string | string[]
}

const emailTemplate = fs.readFileSync(path.resolve('src/utils/template/emailTemplate.html'), 'utf-8')

// Create SES service object.
const sesClient = new SESClient({
  region: envConfig.awsRegion,
  credentials: {
    secretAccessKey: envConfig.awsSecretAccessKey,
    accessKeyId: envConfig.awsAccessKeyId
  }
})

const emailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  body,
  subject,
  replyToAddresses = []
}: sendEmailCommandType) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

const sendVerifyEmail = (toAddress: string, subject: string, body: string) => {
  const sendEmailCommand = emailCommand({
    fromAddress: envConfig.sesFromAddress,
    body: body,
    subject: subject,
    toAddresses: toAddress
  })
  return sesClient.send(sendEmailCommand)
}

export const sendForgotPasswordEmail = (
  toAddress: string,
  forgot_password_token: string,
  template: string = emailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Forgot Password',
    template
      .replace('{{title}}', 'Reset your password')
      .replace('{{content}}', 'Click the button below to reset your password')
      .replace('{{titleLink}}', 'Verify')
      .replace('{{link}}', `${envConfig.clientUrl}/verify-forgot-password?token=${forgot_password_token}`)
  )
}

export const sendVerifyRegisterEmail = (
  toAddress: string,
  verify_email_token: string,
  template: string = emailTemplate
) => {
  return sendVerifyEmail(
    toAddress,
    'Verify your mail registration',
    template
      .replace('{{title}}', 'Please verify your email')
      .replace('{{content}}', 'Click the button below to verify your email')
      .replace('{{titleLink}}', 'Verify')
      .replace('{{link}}', `${envConfig.clientUrl}/verify-email?token=${verify_email_token}`)
  )
}
