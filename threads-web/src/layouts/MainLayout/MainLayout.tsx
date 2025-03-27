/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */
import React from "react"
import Sidebar from "~/components/Sidebar/Sidebar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container bg-neutral-50'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
        <div className='md:col-span-1 '>
          <Sidebar className='sticky top-0 left-0' />
        </div>
        <div className='md:col-span-11 '>{children}</div>
      </div>
    </div>
  )
}
