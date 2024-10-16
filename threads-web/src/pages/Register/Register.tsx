import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { authApi } from '~/apis/auth.api'
import InputText from '~/components/InputText'
import path from '~/constant/path'
import { ErrorResponse } from '~/types/utils.type'
import { isAxiosUnprocessableEntityError } from '~/utils/auth'
import { RegisterSchemaYup, registerSchemaYup } from '~/utils/yupSchema'

type FormData = RegisterSchemaYup
export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchemaYup)
  })

  const registerMutation = useMutation({
    mutationFn: (body: FormData) => authApi.register(body)
  })

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data, {
      onSuccess: (data) => {
        toast.success(data.data.message, { autoClose: 3000 })
        navigate(path.home)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.errors
          if (formError) {
            console.log('formError: ', formError)
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
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
        <div className='p-6 flex flex-col justify-between items-center'>
          <span className='text-md text-stone-950 font-bold'>Register Threads</span>
          <div className='mt-4 w-full'>
            <InputText
              register={register}
              type='email'
              name='email'
              placeholder='Email'
              errorMessage={errors.email?.message}
            />
          </div>
          <div className='mt-2 w-full'>
            <InputText
              register={register}
              type='password'
              name='password'
              placeholder='Password'
              errorMessage={errors.password?.message}
              autoComplete='on'
            />
          </div>
          <div className='mt-2 w-full'>
            <InputText
              register={register}
              type='password'
              name='confirm_password'
              placeholder='Cofirm password'
              errorMessage={errors.confirm_password?.message}
              autoComplete='on'
            />
          </div>
          <div className='mt-2 w-full'>
            <button type='submit' className='bg-gray-950 text-white text-sm p-4 rounded-xl w-full'>
              Sign Up
            </button>
          </div>
          <hr className='w-full mt-8'></hr>
        </div>
      </form>
    </div>
  )
}
