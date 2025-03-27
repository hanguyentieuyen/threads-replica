/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { Modal, ModalContent, ModalTrigger } from "~/components/Modal/Modal"
import Tabs from "~/components/Tab/Tabs"
import { User } from "~/types/user.type"
import { UserFollowerList } from "./UserFollowerList"
import { UserFollowingList } from "./UserFollowingList"

interface ProfileHeaderProps {
  user?: User
}
const tabData = [
  { value: "follower", label: "Follower", content: <UserFollowerList /> },
  { value: "following", label: "Following", content: <UserFollowingList /> }
]
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
        <img src='../src/assets/capy.jpg' alt='Follower 2' className='w-5 h-5 rounded-full' />
        <img src='../src/assets/capela.jpg' alt='Follower 1' className='w-5 h-5 rounded-full' />
        <Modal>
          <div className='px-6'>
            <ModalTrigger>
              <span className='text-sm text-gray-500'>{17} followers</span>
            </ModalTrigger>
          </div>
          <ModalContent>
            <div className='flex mt-4 space-x-2'>
              <Tabs defaultValue='follower' tabs={tabData} />
            </div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  )
}
