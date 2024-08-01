export default function Login() {
  return (
    <div className='w-full flex flex-col justify-between items-center overflow-hidden relative min-h-[100vh]'>
      <div className='absolute top-0'>
        <img src='src/assets/threads-bg-png.png' />
      </div>
      <div className='mt-[30vh] p-6 mb-14 w-full max-w-[400px] z-10'>
        <form>
          <div className='p-6 flex flex-col justify-between items-center'>
            <span className='text-md text-stone-950 font-bold'>Đăng nhập tài khoản Threads</span>
            <div className='mt-4 w-full'>
              <input
                type='email'
                name='email'
                placeholder='Email'
                className='bg-[#f5f5f5] w-full p-4 rounded-xl outline-none'
              />
            </div>
            <div className='mt-2 w-full'>
              <input
                type='password'
                name='password'
                placeholder='Password'
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
                <a href=''>Tạo tài khoản</a>
              </span>
            </div>
            <hr className='w-full mt-8'></hr>
          </div>
        </form>
      </div>
      <div className='w-full h-9'>
        <ul className='flex justify-center text-gray-400 text-xs'>
          <li className='mx-2'>© 2024</li>
          <li className='mx-2'>
            <a href='#'>Điều khoản của Threads</a>
          </li>
          <li className='mx-2'>
            <a>Chính sách riêng tư</a>
          </li>
          <li className='mx-2'>
            <a>Chính sách cookie</a>
          </li>
          <li className='mx-2'>
            <a>Báo cáo sự cố</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
