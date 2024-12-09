import React from "react"

interface Props {
  children?: React.ReactNode
}
export default function ContentContainer({ children }: Props) {
  return <div className='max-w-2xl mx-auto border border-gray-300 bg-white rounded-t-2xl shadow-md'>{children}</div>
}
