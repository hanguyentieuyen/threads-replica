import React from 'react'
import RegisterFooter from '~/components/RegisterFooter'
import RegisterHeader from '~/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Props) {
  return (
    <div className='w-full flex flex-col justify-between items-center overflow-hidden relative min-h-[100vh]'>
      <RegisterHeader />
      {children}
      <RegisterFooter />
    </div>
  )
}
