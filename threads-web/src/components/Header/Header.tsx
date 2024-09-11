import React from 'react'
import { FaHome, FaSearch, FaSync, FaHeart, FaUser } from 'react-icons/fa'

function Header() {
  return (
    <header className='flex items-center justify-between p-4 border-b'>
      <div className='text-2xl font-bold'>@</div>
      <nav className='flex items-center space-x-4'>
        <FaHome className='text-xl' />
        <FaSearch className='text-xl' />
        <FaSync className='text-xl' />
        <FaHeart className='text-xl' />
        <FaUser className='text-xl' />
      </nav>
      <button className='bg-black text-white px-4 py-2 rounded-full'>Đăng nhập</button>
    </header>
  )
}

export default Header
