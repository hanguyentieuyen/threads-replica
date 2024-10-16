import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { authApi } from '~/apis/auth.api'
import { ResetPasswordSchemaYup } from '~/utils/yupSchema'

type QueryParam = Pick<ResetPasswordSchemaYup, 'forgot_password_token'>
export default function VerifyForgotPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const verifyForgotPasswordMutation = useMutation({
    mutationFn: (body: QueryParam) => authApi.verifyForgotPassword(body)
  })

  useEffect(() => {
    // verifyForgotPasswordMutation.mutate(token, {
    //   onSuccess: () => {
    //   }
    // })
  }, [])
  return (
    <div className='h-screen bg-white'>
      <div className='flex justify-center items-center h-full'>
        <img className='h-16 w-16' src='https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif' alt='' />
      </div>
    </div>
  )
}
