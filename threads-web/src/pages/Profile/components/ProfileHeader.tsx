import { User } from "~/types/user.type"

interface ProfileHeaderProps {
  user?: User
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-xl font-bold'>{user?.name}</h1>
        <p className='text-gray-500'>@{user?.username}</p>
        <div className='flex mt-2'>
          <div className='flex items-center space-x-1'>
            <img src='follower1.jpg' alt='Follower 1' className='w-6 h-6 rounded-full' />
            <img src='follower2.jpg' alt='Follower 2' className='w-6 h-6 rounded-full' />
            <span className='text-sm text-gray-500'>{17} followers</span>
          </div>
        </div>
      </div>
      <img src={user?.avatar} alt='Profile' className='w-16 h-16 rounded-full' />
    </div>
  )
}
