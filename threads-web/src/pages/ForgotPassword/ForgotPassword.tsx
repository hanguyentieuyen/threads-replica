import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { authApi } from '~/apis/auth.api'
import { ErrorResponse } from '~/types/utils.type'
import { isAxiosUnprocessableEntityError } from '~/utils/auth'
import { registerSchemaYup, RegisterSchemaYup } from '~/utils/yupSchema'

export default function ForgotPassword() {
  type FormData = Pick<RegisterSchemaYup, 'email'>
  const forgotPasswordSchema = registerSchemaYup.pick(['email'])
  // form
  const { register, handleSubmit, setError } = useForm<FormData>({
    resolver: yupResolver(forgotPasswordSchema)
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (body: FormData) => authApi.forgotPassword(body)
  })
  const onSubmit = handleSubmit((data) => {
    forgotPasswordMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.data.message)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            Object.keys(formError).forEach((key) => {
              console.log('key: ', formError[key].msg)
              setError(key as keyof FormData, {
                message: formError[key].msg,
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })
  return (
    <div className='mt-[30vh] p-6 mb-14 w-full max-w-[400px] z-10'>
      <form onSubmit={onSubmit}>
        <span className='text-md text-stone-950 font-bold'>Đặt lại mật khẩu</span>
        <div className='mt-4 w-full'>
          <input
            {...register('email')}
            type='email'
            name='email'
            placeholder='Email'
            className='bg-[#f5f5f5] w-full p-4 rounded-xl outline-none'
          />
        </div>
        <div className='mt-2 w-full'>
          <button type='submit' className='bg-gray-950 text-white text-sm p-4 rounded-xl w-full'>
            Gửi mail xác nhận
          </button>
        </div>
      </form>
    </div>
  )
}
