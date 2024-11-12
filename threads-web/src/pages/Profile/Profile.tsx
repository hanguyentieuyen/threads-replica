import ContentContainer from "~/components/ContentContainer"
import { Helmet } from "react-helmet-async"
import Button from "~/components/Button"
import ProfileCard from "~/components/ProfileCard"
import { Check, Pen } from "lucide-react"
import HeaderContainer from "~/components/HeaderContainer"
import Tabs from "~/components/Tab/Tabs"

const Profile = () => {
  const tabData = [
    { value: "tab1", label: "Thread", content: <div>Content for Tab 1</div> },
    { value: "tab2", label: "Thread trả lời", content: <div>Content for Tab 2</div> },
    { value: "tab3", label: "Bài đăng lại", content: <div>Content for Tab 3</div> }
  ]
  return (
    <>
      <Helmet>
        <title>hayen (@hn13.mew) on Threads</title>
        <meta name='description' content='Profile - Threads Replica' />
      </Helmet>
      <HeaderContainer />
      <ContentContainer>
        {/* Profile Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>hayen</h1>
            <p className='text-gray-500'>@hn13.mew</p>
            <div className='flex mt-2'>
              {/* Followers */}
              <div className='flex items-center space-x-1'>
                <img src='follower1.jpg' alt='Follower 1' className='w-6 h-6 rounded-full' />
                <img src='follower2.jpg' alt='Follower 2' className='w-6 h-6 rounded-full' />
                <span className='text-sm text-gray-500'>17 người theo dõi</span>
              </div>
            </div>
          </div>
          <img src='profile-pic.jpg' alt='Profile' className='w-16 h-16 rounded-full' />
        </div>

        {/* Edit Profile Button */}
        <Button className='text-gray-800 font-semibold text-sm p-1.5 w-full rounded-lg border mt-10'>
          Chỉnh sửa trang cá nhân
        </Button>

        {/* Tabs */}
        <div className='flex mt-4 space-x-4'>
          <Tabs defaultValue='tab1' tabs={tabData} />
        </div>

        {/* New Post Input */}
        <div className='flex items-center mt-4'>
          <img src='avatar.jpg' alt='Avatar' className='w-8 h-8 rounded-full' />
          <input type='text' placeholder='Có gì mới?' className='flex-1 ml-4 p-2 border rounded-md' />
          <button className='ml-2 bg-black text-white px-4 py-1 rounded-md'>Đăng</button>
        </div>

        {/* Profile Completion Section */}
        <div className='mt-6'>
          <h2 className='text-gray-600 font-semibold'>Hoàn tất trang cá nhân</h2>
          <div className='flex mt-4 space-x-4'>
            <ProfileCard
              image='https://images.unsplash.com/photo-1719937051058-63705ed35502?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8'
              name='Tiffany Janzen'
              username='tiffintech'
              buttonText='Theo dõi'
              onButtonClick={() => alert("Followed")}
            />
            {/* <ProfileCard
              icon={<SquarePen width={20} height={20} />}
              name='Tạo thread'
              bio='Cho mọi người biết bạn đang nghĩ gì hoặc chia sẻ về một hoạt động nổi bật mới đây.'
              buttonText='Thêm'
              onButtonClick={() => alert('Add Bio clicked')}
            /> */}
            <ProfileCard
              icon={<Pen width={20} height={20} />}
              name='Thêm tiểu sử'
              bio='Hãy giới thiệu về bản thân và cho mọi người biết bạn thích gì.'
              buttonText='Thêm'
              onButtonClick={() => alert("Add Bio clicked")}
            />
            <ProfileCard
              icon={<Check width={20} height={20} />}
              name='Thêm ảnh đại diện'
              bio='Giúp mọi người dễ dàng nhận ra bạn hơn.'
              buttonText='Thêm'
              onButtonClick={() => alert("Add Bio clicked")}
            />
          </div>
        </div>
      </ContentContainer>
    </>
  )
}

export default Profile
