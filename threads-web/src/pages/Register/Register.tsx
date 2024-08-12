export default function Register() {
  return (
    <div className='mt-[30vh] p-6 mb-14 w-full max-w-[400px] z-10'>
      <form>
        <div className='p-6 flex flex-col justify-between items-center'>
          <span className='text-md text-stone-950 font-bold'>Đăng ký tài khoản Threads</span>
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
              placeholder='Mật khẩu'
              className='bg-[#f5f5f5] w-full p-4 rounded-xl outline-none'
            />
          </div>
          <div className='mt-2 w-full'>
            <input
              type='password'
              name='password'
              placeholder='Nhập lại mật khẩu'
              className='bg-[#f5f5f5] w-full p-4 rounded-xl outline-none'
            />
          </div>
          <div className='mt-2 w-full'>
            <button type='submit' className='bg-gray-950 text-white text-sm p-4 rounded-xl w-full'>
              Đăng ký
            </button>
          </div>
          <hr className='w-full mt-8'></hr>
        </div>
      </form>
    </div>
  )
}
