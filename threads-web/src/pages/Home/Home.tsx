import React from 'react'
// import Avatar from '~/components/PostAvatar'
// import { DialogExample } from '~/components/Dialog/Dialog'
import PostCard from '~/components/PostCard/PostCard'
// import Sidebar from '~/components/Sidebar/Sidebar'
// import FollowerCard from '~/components/FollowerCard'
import ContentContainer from '~/components/ContentContainer'
import HeaderContainer from '~/components/HeaderContainer'

const myAvatarUrl =
  'https://scontent-atl3-2.cdninstagram.com/v/t51.2885-19/464668100_569595762081485_4171869328580498312_n.jpg?stp=dst-jpg_s640x640&_nc_ht=scontent-atl3-2.cdninstagram.com&_nc_cat=105&_nc_ohc=v8KsJuW525sQ7kNvgFPWhjT&_nc_gid=b8fd02779da04da697e63da7a0051603&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYD--Gq5K-TSLgaiNUybOEXGrzhJCn-dSFaCVsYh12ZzRg&oe=672422AF&_nc_sid=10d13b'
export default function Home() {
  return (
    <>
      <HeaderContainer />
      <ContentContainer>
        <PostCard />
        {/* <DialogExample /> */}
        {/* <Sidebar /> */}
        {/* <FollowerCard
        username='hn13.mew'
        fullName='hayen'
        profileImage={myAvatarUrl}
        followersCount={26000}
        isVerified={false}
      /> */}
        {/* <Avatar name={'hayen'} image='#' postedTime='22 giờ' /> */}
      </ContentContainer>
    </>
  )
}
