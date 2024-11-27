import Button from "~/components/Button"
import FollowerCard from "~/components/FollowerCard"
import HeaderContainer from "~/components/HeaderContainer"

export default function Search() {
  const fakeData = Array.from({ length: 10 }, (_, index) => index + 1)
  return (
    <div>
      <div className='sticky top-0 z-10'>
        <HeaderContainer />
      </div>
      <div className='border border-gray-300 bg-white rounded-t-2xl shadow-md'>
        <div className='w-full border-b flex items-center justify-between p-5'>
          <img alt='avatar' src='https://via.placeholder.com/40' className='rounded-full w-10 h-10' />
          <span className='text-left text-sm text-slate-400 w-full mx-2'>Có gì mới ?</span>
          <Button className='border font-semibold text-gray-700 text-base py-2 px-5 rounded-lg'>Đăng</Button>
        </div>
        {fakeData.map((item) => (
          <div key={item} className='p-4 border-b last:border-b-0'>
            <FollowerCard username='@hayen' fullName='Hayen' profileImage='' followersCount={34} isVerified />
          </div>
        ))}
      </div>
    </div>
  )
}
