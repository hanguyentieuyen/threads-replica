import { User } from "~/types/user.type"

interface ProfileHeaderProps {
  user?: User
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className='p-6'>
      <div className='w-full flex justify-between items-center mb-4'>
        <div className='text-left'>
          <p className='text-2xl font-bold'>{user?.name || "hayen"} </p>
          <p className='text-gray-500 text-sm'>{user?.username || "hn13.mew"} </p>
        </div>
        <img src='../src/assets/capy.jpg' alt='Profile' className='w-20 h-20 rounded-full' />
      </div>
      <div className='flex items-center'>
        <img src='../src/assets/capela.jpg' alt='Follower 1' className='w-5 h-5 rounded-full' />
        <img src='../src/assets/capy.jpg' alt='Follower 2' className='w-5 h-5 rounded-full' />
        <span className='text-sm text-gray-500'>{17} followers</span>
      </div>
    </div>
  )
}
