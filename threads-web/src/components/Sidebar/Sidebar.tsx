import React from 'react'
import { Home, Search, PlusCircle, Heart, User, Bookmark, Menu } from 'lucide-react'

type SidebarProps = {
  className?: string
}

type SidebarItemProps = {
  icon: React.ReactNode
  isActive?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, isActive = false }) => (
  <li>
    <a
      href='#'
      className={`flex items-center p-2 text-base font-normal rounded-lg ${
        isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
    </a>
  </li>
)

export default function Sidebar({ className = '' }: SidebarProps) {
  return (
    <aside className={`w-20 h-screen transition-transform ${className}`} aria-label='Sidebar'>
      <div className='h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800'>
        <ul className='space-y-2'>
          <SidebarItem icon={<Home className='w-8 h-8' />} isActive />
          <SidebarItem icon={<Search className='w-8 h-8' />} />
          <SidebarItem icon={<PlusCircle className='w-8 h-8' />} />
          <SidebarItem icon={<Heart className='w-8 h-8' />} />
          <SidebarItem icon={<User className='w-8 h-8' />} />
          <SidebarItem icon={<Bookmark className='w-8 h-8' />} />
          <SidebarItem icon={<Menu className='w-8 h-8' />} />
        </ul>
      </div>
    </aside>
  )
}
