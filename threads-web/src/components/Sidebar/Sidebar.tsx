/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import path from "~/constant/path"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "~/apis/auth.api"
import { toast } from "react-toastify"
import { clearLocalStorage } from "~/utils/auth"
import Icon from "../Icon"
import i18n from "~/lib/i18n"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
export const languages = [
  {
    value: "en",
    label: "English"
  },
  {
    value: "vi",
    label: "Tiếng Việt"
  }
]
type SidebarProps = {
  className?: string
}

type SidebarItemProps = {
  icon: React.ReactNode
  path?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(({ icon, path, onClick, ...props }, ref) => {
  const localPath = useLocation().pathname
  const isActive = localPath === path
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (path) {
      e.preventDefault()

      navigate(path || "/")
    }
  }

  return (
    <li>
      <a
        {...props}
        ref={ref}
        onClick={(e) => {
          handleClick(e)
          onClick?.(e)
        }}
        href='#'
        className={`flex items-center p-2 text-base font-normal rounded-lg ${
          isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        {icon}
      </a>
    </li>
  )
})
export default function Sidebar({ className = "" }: SidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedLanguage, setSelectedLanguage] = React.useState(() => {
    return localStorage.getItem("language") || "vi"
  })

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value)
    i18n.changeLanguage(value)
    localStorage.setItem("language", value)
  }

  const logoutMutation = useMutation({
    mutationFn: (body: { refresh_token: string }) => authApi.logout(body)
  })

  const handleLogout = () => {
    logoutMutation.mutate(
      { refresh_token: localStorage.getItem("refresh_token") || "" },
      {
        onSuccess: (data) => {
          clearLocalStorage()
          toast.success(data.data.message)
          navigate(path.login)
        },
        onError: (error: Error) => {
          const message = error.message || "Logout failed. Please try again."
          toast.error(message)
          console.error("Error logging out:", error)
        }
      }
    )
  }

  return (
    <aside className={`w-full h-screen transition-transform ${className}`} aria-label='Sidebar'>
      <div className='h-full py-4 overflow-hidden'>
        <ul className='flex-col flex h-full items-center'>
          <div className='space-y-2 h-full'>
            <img src='../src/assets/threads-app-icon.png' width={40} height={40} />
          </div>
          <ul className='flex flex-col justify-center h-full space-y-4'>
            <SidebarItem icon={<Icon name='Home' className='w-8 h-8' />} path={path.posts} />
            <SidebarItem icon={<Icon name='Search' className='w-8 h-8' />} path={path.search} />
            <SidebarItem icon={<Icon name='PlusCircle' className='w-8 h-8' />} />
            <SidebarItem icon={<Icon name='Heart' className='w-8 h-8' />} />
            <SidebarItem icon={<Icon name='User' className='w-8 h-8' />} path={path.me} />
          </ul>
          <ul className='flex flex-col justify-end h-full space-y-4'>
            <SidebarItem icon={<Icon name='Bookmark' className='w-8 h-8' />} />
            <Popover>
              <PopoverTrigger asChild>
                <SidebarItem icon={<Icon name='Menu' className='w-8 h-8' />} />
              </PopoverTrigger>
              <PopoverContent align='start' className='p-3'>
                <div className='w-full mb-3'>
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className='flex justify-between gap-1 bg-white p-0 px-3.5 '>
                      <SelectValue placeholder='Pick an option' className='mr-auto' />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value.toString()}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div
                  onClick={handleLogout}
                  className='text-red-500 font-semibold p-2 text-sm cursor-pointer hover:bg-slate-100 hover:rounded-lg'
                >
                  {t("logout")}
                </div>
              </PopoverContent>
            </Popover>
          </ul>
        </ul>
      </div>
    </aside>
  )
}
