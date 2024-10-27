import React from 'react'
import Avatar from '~/components/Avatar'
import { DialogExample } from '~/components/Dialog/Dialog'
import { Dropdown } from '~/components/Dropdown'
import Sidebar from '~/components/Sidebar/Sidebar'
import UserProfileCard from '~/components/UserProfileCard'

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

const myAvatarUrl =
  'https://scontent-atl3-2.cdninstagram.com/v/t51.2885-19/464668100_569595762081485_4171869328580498312_n.jpg?stp=dst-jpg_s640x640&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_cat=105&_nc_ohc=v8KsJuW525sQ7kNvgFPWhjT&_nc_gid=b8fd02779da04da697e63da7a0051603&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYD--Gq5K-TSLgaiNUybOEXGrzhJCn-dSFaCVsYh12ZzRg&oe=672422AF&_nc_sid=10d13b'
export default function Home() {
  return (
    <div>
      Home
      <DialogExample />
      {/* <Sidebar /> */}
      {/* <UserProfileCard
        username='hn13.mew'
        fullName='hayen'
        profileImage={myAvatarUrl}
        followersCount={26000}
        isVerified={false}
      /> */}
      <Avatar name={'hayen'} image='#' postedTime='22 giờ' />
      {/* <Dropdown title='dành cho bạn' items={items} icon='x' /> */}
    </div>
  )
}
