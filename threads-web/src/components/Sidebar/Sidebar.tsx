import React from "react"
import { Home, Search, PlusCircle, Heart, User, Bookmark, Menu } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import path from "~/constant/path"

type SidebarProps = {
  className?: string
}

type SidebarItemProps = {
  icon: React.ReactNode
  path?: string
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, path }) => {
  const localPath = useLocation().pathname
  const isActive = localPath === path
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    navigate(path || "/")
  }

  return (
    <li>
      <a
        onClick={handleClick}
        href='#'
        className={`flex items-center p-2 text-base font-normal rounded-lg ${
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        {icon}
      </a>
    </li>
  )
}

export default function Sidebar({ className = "" }: SidebarProps) {
  return (
    <aside className={`w-full h-screen transition-transform ${className}`} aria-label='Sidebar'>
      <div className='h-full py-4 overflow-hidden'>
        <ul className='flex-col flex h-full items-center'>
          <div className='space-y-2 h-full'>
            <img src='../src/assets/threads-app-icon.png' width={40} height={40} />
          </div>
          <ul className='flex flex-col justify-center h-full space-y-4'>
            <SidebarItem icon={<Home className='w-8 h-8' />} path={path.posts} />
            <SidebarItem icon={<Search className='w-8 h-8' />} />
            <SidebarItem icon={<PlusCircle className='w-8 h-8' />} />
            <SidebarItem icon={<Heart className='w-8 h-8' />} />
            <SidebarItem icon={<User className='w-8 h-8' />} path={path.me} />
          </ul>
          <ul className='flex flex-col justify-end h-full space-y-4'>
            <SidebarItem icon={<Bookmark className='w-8 h-8' />} />
            <SidebarItem icon={<Menu className='w-8 h-8' />} />
          </ul>
        </ul>
      </div>
    </aside>
  )
}
