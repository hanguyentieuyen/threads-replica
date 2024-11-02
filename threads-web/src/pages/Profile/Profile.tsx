import ContentContainer from '~/components/ContentContainer'
import { Helmet } from 'react-helmet-async'
const Profile = () => {
  return (
    <>
      <Helmet>
        <title>hayen (@hn13.mew) on Threads</title>
        <meta name='description' content='Profile - Threads Replica' />
      </Helmet>
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
        <button className='w-full mt-4 bg-gray-100 text-gray-700 rounded-md py-2 font-semibold'>
          Chỉnh sửa trang cá nhân
        </button>

        {/* Tabs */}
        <div className='flex mt-4 space-x-4 border-b-2'>
          <button className='text-black font-semibold pb-2 border-b-2 border-black'>Thread</button>
          <button className='text-gray-500'>Thread trả lời</button>
          <button className='text-gray-500'>Bài đăng lại</button>
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
          <div className='flex mt-4 space-x-2'>
            {/* Card 1 */}
            <div className='flex flex-col items-center p-4 bg-gray-100 rounded-lg flex-1'>
              <div className='text-2xl'>📝</div>
              <h3 className='font-semibold mt-2'>Tạo thread</h3>
              <p className='text-gray-500 text-sm text-center'>
                Cho mọi người biết bạn đang nghĩ gì hoặc chia sẻ về một hoạt động nổi bật mới đây.
              </p>
              <button className='mt-2 bg-black text-white px-4 py-1 rounded-md'>Tạo</button>
            </div>

            {/* Card 2 */}
            <div className='flex flex-col items-center p-4 bg-gray-100 rounded-lg flex-1'>
              <div className='text-2xl'>✏️</div>
              <h3 className='font-semibold mt-2'>Thêm tiểu sử</h3>
              <p className='text-gray-500 text-sm text-center'>
                Hãy giới thiệu về bản thân và cho mọi người biết bạn thích gì.
              </p>
              <button className='mt-2 bg-black text-white px-4 py-1 rounded-md'>Thêm</button>
            </div>

            {/* Card 3 */}
            <div className='flex flex-col items-center p-4 bg-gray-100 rounded-lg flex-1'>
              <div className='text-2xl'>✅</div>
              <h3 className='font-semibold mt-2'>Thêm ảnh đại diện</h3>
              <p className='text-gray-500 text-sm text-center'>Giúp mọi người dễ dàng nhận ra bạn hơn.</p>
              <button className='mt-2 bg-gray-400 text-white px-4 py-1 rounded-md'>Xong</button>
            </div>
          </div>
        </div>
      </ContentContainer>
    </>
  )
}

export default Profile
