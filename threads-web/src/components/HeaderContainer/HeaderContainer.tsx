import React from 'react'
import { Dropdown } from '../Dropdown'
const items = [
  {
    label: 'option1',
    href: '#',
    active: true
  },
  {
    label: 'option2',
    href: '#',
    active: true
  },
  {
    label: 'option3',
    href: '#',
    active: true
  }
]

export default function HeaderContainer() {
  return (
    <div className='max-w-2xl mx-auto flex items-center justify-center h-[60px] bg-slate-50'>
      <Dropdown title='dành cho bạn' items={items} icon='x' />
    </div>
  )
}
