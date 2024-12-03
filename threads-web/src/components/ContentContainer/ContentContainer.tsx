import React from "react"

interface Props {
  children?: React.ReactNode
}
export default function ContentContainer({ children }: Props) {
  return (
    <div className='max-w-2xl mx-auto bg-white rounded-lg shadow-md border-slate-950 p-6 overflow-auto'>{children}</div>
  )
}
