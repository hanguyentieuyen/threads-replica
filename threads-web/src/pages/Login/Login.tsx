import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import path from '~/constant/path'
import { registerSchemaYup, RegisterSchemaYup } from '~/utils/yupSchema'

type FormData = Pick<RegisterSchemaYup, 'email' | 'password'>
const loginSchema = registerSchemaYup.pick(['email', 'password'])
export default function Login() {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const handleSubmitForm = handleSubmit((data) => {
    console.log(data)
  })
  return (
    <div className='mt-[30vh] p-6 mb-14 w-full max-w-[400px] z-10'>
      <form onSubmit={handleSubmitForm}>
        <div className='p-6 flex flex-col justify-between items-center'>
          <span className='text-md text-stone-950 font-bold'>Đăng nhập tài khoản Threads</span>
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
            <input
              {...register('password')}
              type='password'
              name='password'
              placeholder='Mật khẩu'
              className='bg-[#f5f5f5] w-full p-4 rounded-xl outline-none'
            />
          </div>
          <div className='mt-2 w-full'>
            <button type='submit' className='bg-gray-950 text-white text-sm p-4 rounded-xl w-full'>
              Đăng nhập
            </button>
          </div>
          <div className='mt-5 w-full flex justify-between flex-shrink-0'>
            <span className='text-sm text-gray-400'>
              <a href=''>Quên mật khẩu?</a>
            </span>
            <span className='text-sm text-gray-400'>
              <Link to={path.register}>Tạo tài khoản</Link>
            </span>
          </div>
          <hr className='w-full mt-8'></hr>
        </div>
      </form>
    </div>
  )
}
