/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useState } from "react"
import Button from "../Button"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"

type AvatarProps = {
  username: string
  user_avatar: string
  postedTime?: string
}
export default function PostAvatar({ user_avatar, username, postedTime }: AvatarProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className='flex items-center space-x-3'>
      <div className='relative'>
        <img className='w-10 h-10 rounded-full border-2 border-pink-500' src={user_avatar} alt='User avatar' />
        <div className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center'>
          <span className='text-xs font-bold'>+</span>
        </div>
      </div>
      <div className='flex items-center'>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <span
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
              className='hover:underline focus:outline-none'
            >
              {username}
            </span>
          </PopoverTrigger>
          <PopoverContent className='w-80 rounded-lg shadow-lg bg-white p-4 border border-gray-200' sideOffset={5}>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0'>
                <img src='/api/placeholder/64/64' alt='User avatar' className='w-16 h-16 rounded-full object-cover' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-bold'>{username}</h3>
                <p className='text-gray-600 text-sm'>{username}</p>

                <div className='mt-2'>{/* <p className='text-sm'>{bio}</p> */}</div>

                <div className='mt-3 flex items-center gap-1 text-sm text-gray-600'>
                  <span className='flex items-center gap-1'>
                    <span className='inline-flex'>🌐👤</span>
                    <span>1.967 người theo dõi</span>
                  </span>
                </div>

                <div className='mt-3'>
                  <Button className='w-full py-1.5 px-3 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition'>
                    Đang theo dõi
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <span className='text-sm text-gray-500'>{postedTime}</span>
      </div>
    </div>
  )
}
