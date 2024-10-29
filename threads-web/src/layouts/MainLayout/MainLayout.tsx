import React from 'react'
import Sidebar from '~/components/Sidebar/Sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container text-gray-600 h-screen'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
        <div className='md:col-span-1'>
          <Sidebar />
        </div>
        <div className='md:col-span-11'>{children}</div>
      </div>
    </div>
  )
}
