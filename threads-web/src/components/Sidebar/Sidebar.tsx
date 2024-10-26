import React from 'react'
import { Home, Search, PlusCircle, Heart, User, Bookmark, Menu } from 'lucide-react'

interface SidebarProps {
  className?: string
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, isActive = false }) => (
  <li>
    <a
      href='#'
      className={`flex items-center p-2 text-base font-normal rounded-lg ${
        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className='ml-3'>{label}</span>
    </a>
  </li>
)

export default function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`w-64 h-screen transition-transform ${className}`} aria-label='Sidebar'>
      <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
        <ul className='space-y-2'>
          <SidebarItem icon={<Home className='w-6 h-6' />} label='Home' isActive />
          <SidebarItem icon={<Search className='w-6 h-6' />} label='Search' />
          <SidebarItem icon={<PlusCircle className='w-6 h-6' />} label='Create' />
          <SidebarItem icon={<Heart className='w-6 h-6' />} label='Favorites' />
          <SidebarItem icon={<User className='w-6 h-6' />} label='Profile' />
          <SidebarItem icon={<Bookmark className='w-6 h-6' />} label='Bookmarks' />
          <SidebarItem icon={<Menu className='w-6 h-6' />} label='More' />
        </ul>
      </div>
    </aside>
  )
}
