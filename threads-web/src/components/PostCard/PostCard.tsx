import { useState } from 'react'
import { BookmarkIcon, EyeOffIcon, BellOffIcon, XIcon, FlagIcon, LinkIcon } from 'lucide-react'
import PostAvatar from '../PostAvatar'

export default function PostCard() {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <PostAvatar name={'Hayen'} image='https://via.placeholder.com/40' postedTime='10 hours ago' />
        <button onClick={() => setShowOptions(!showOptions)} className='text-gray-500 hover:text-gray-700'>
          ...
        </button>
      </div>

      {/* Content */}
      <p className='mt-4 text-gray-800 text-left'>all you need is love 🐱💖</p>
      <div className='flex space-x-2 mt-2'>
        {/* <img src='https://via.placeholder.com/150' alt='Post Image 1' className='w-1/2 rounded-lg' />
        <img src='https://via.placeholder.com/150' alt='Post Image 2' className='w-1/2 rounded-lg' /> */}
      </div>

      {/* Options Dropdown */}
      {showOptions && (
        <div className='absolute right-5 top-12 bg-white rounded-lg shadow-lg py-2 w-40 z-10'>
          <button className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100'>
            <BookmarkIcon className='w-5 h-5 mr-2' />
            Lưu
          </button>
          <button className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100'>
            <EyeOffIcon className='w-5 h-5 mr-2' />
            Không quan tâm
          </button>
          <button className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100'>
            <BellOffIcon className='w-5 h-5 mr-2' />
            Tắt thông báo
          </button>
          <button className='flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100'>
            <XIcon className='w-5 h-5 mr-2' />
            Chặn
          </button>
          <button className='flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100'>
            <FlagIcon className='w-5 h-5 mr-2' />
            Báo cáo
          </button>
          <button className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100'>
            <LinkIcon className='w-5 h-5 mr-2' />
            Sao chép liên kết
          </button>
        </div>
      )}

      {/* Footer */}
      <div className='flex items-center justify-between mt-4 text-gray-500'>
        <div className='flex space-x-4'>
          <button className='flex items-center space-x-1'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M5 15a7 7 0 0010 0M12 8v1M5 15l-2-2a7 7 0 0110-10l2 2M21 21l-6-6'
              />
            </svg>
            <span>575</span>
          </button>
          <button className='flex items-center space-x-1'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M17 8h2a2 2 0 012 2v4a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v4a2 2 0 002 2h2m10 4H7'
              />
            </svg>
            <span>5</span>
          </button>
          <button className='flex items-center space-x-1'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 21v-7a2 2 0 012-2h14a2 2 0 012 2v7'
              />
            </svg>
            <span>42</span>
          </button>
          <button className='flex items-center space-x-1'>
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 5a7 7 0 014.2 1.8m0 6.4a7 7 0 014.8-2m-5.8 2a7 7 0 00-5.8 2m5.8-10a7 7 0 00-4.8 2'
              />
            </svg>
            <span>29</span>
          </button>
        </div>
      </div>
    </div>
  )
}
