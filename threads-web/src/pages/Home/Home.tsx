import React from 'react'
import Avatar from '~/components/Avatar'
import { Dropdown } from '~/components/Dropdown'
import Sidebar from '~/components/Sidebar/Sidebar'

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
export default function Home() {
  return (
    <div>
      Home
      <Sidebar />
      {/* <Avatar /> */}
      <Dropdown title='dành cho bạn' items={items} icon='x' />
    </div>
  )
}
