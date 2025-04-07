/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import React from "react"

interface Props {
  children?: React.ReactNode
}
export default function ContentContainer({ children }: Props) {
  return (
    <div className='relative mx-auto bg-white max-w-2xl w-full h-full border border-gray-300 rounded-t-2xl shadow-md scroll-smooth overflow-y-auto'>
      {children}
    </div>
  )
}
