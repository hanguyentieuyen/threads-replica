import { useState } from 'react'
import {
  BookmarkIcon,
  EyeOffIcon,
  BellOffIcon,
  XIcon,
  FlagIcon,
  LinkIcon,
  MessageCircle,
  Send,
  Repeat2,
  Heart,
  Ellipsis
} from 'lucide-react'
import PostAvatar from '../PostAvatar'

export default function PostCard() {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <PostAvatar name={'Hayen'} image='https://via.placeholder.com/40' postedTime='10 hours ago' />
        <button onClick={() => setShowOptions(!showOptions)} className='text-gray-500 hover:text-gray-700'>
          <Ellipsis strokeWidth={2} size={16} />
        </button>
      </div>

      {/* Content */}
      <p className='mt-4 text-gray-800 text-left'>all you need is love 🐱💖</p>
      <div className='flex space-x-2 mt-2'>
        {/* <img src='https://via.placeholder.com/150' alt='Post Image 1' className='w-1/2 rounded-lg' />
        <img src='https://via.placeholder.com/150' alt='Post Image 2' className='w-1/2 rounded-lg' /> */}
      </div>

      {/* Options Dropdown */}
      {/* {showOptions && (
        <div className='absolute right-5 top-12 bg-white rounded-lg shadow-lg py-2 w-40 z-10'>
          <button className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100'>
            <BookmarkIcon className='w-5 h-5 mr-2' />
            Lưu
          </button>
          <button className='flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100'>
            <LinkIcon className='w-5 h-5 mr-2' />
            Sao chép liên kết
          </button>
        </div>
      )} */}

      {/* Footer */}
      <div className='flex items-center justify-between mt-4 text-gray-500'>
        <div className='flex space-x-4'>
          <button className='flex items-center space-x-1'>
            <Heart strokeWidth={2} size={16} />
            <span>575</span>
          </button>
          <button className='flex items-center space-x-1'>
            <MessageCircle strokeWidth={2} size={16} />
            <span>5</span>
          </button>
          <button className='flex items-center space-x-1'>
            <Repeat2 strokeWidth={2} />
            <span>42</span>
          </button>
          <button className='flex items-center space-x-1'>
            <Send strokeWidth={2} size={16} />
            <span>29</span>
          </button>
        </div>
      </div>
    </div>
  )
}
