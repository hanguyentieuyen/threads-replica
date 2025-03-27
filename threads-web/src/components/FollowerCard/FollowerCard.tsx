/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { useMutation } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import { toast } from "react-toastify"
import { userApi } from "~/apis/user.api"
import { useToggleState } from "~/hooks/useToggleState"
import { SuccessResponse } from "~/types/utils.type"
import Button from "../Button"
import { useTranslation } from "react-i18next"

type UserProfileCardProps = {
  username?: string
  fullName?: string
  followersCount?: number
  profileImage?: string
  isVerified?: boolean
}

export default function FollowerCard({
  username,
  fullName,
  followersCount,
  profileImage,
  isVerified = false
}: UserProfileCardProps) {
  const formattedFollowers =
    followersCount && new Intl.NumberFormat("en-US", { notation: "compact" }).format(followersCount)
  const { t } = useTranslation()
  const [isFollow, setIsFollow] = useToggleState(false)

  // Test api
  const followed_user_id = "66ba5da551e0c344d1fc0269"

  const followMutation = useMutation({
    mutationFn: (body: { followed_user_id: string }) => userApi.follow(body)
  })

  const unfollowMutation = useMutation({
    mutationFn: (followed_user_id: string) => userApi.unfollow(followed_user_id)
  })

  const handleFollow = () => {
    followMutation.mutate(
      { followed_user_id },
      {
        onSuccess: (data: AxiosResponse<SuccessResponse<unknown>, unknown>) => toast.success(data.data.message),
        onError: (error: Error) => toast.error(error.message)
      }
    )
  }

  const handleUnfollow = () => {
    unfollowMutation.mutate(followed_user_id, {
      onSuccess: (data: AxiosResponse<SuccessResponse<unknown>, unknown>) => toast.success(data.data.message),
      onError: (error: Error) => toast.error(error.message)
    })
  }

  const handleFollowToggle = () => {
    setIsFollow()
    if (!isFollow) {
      handleFollow()
    } else {
      handleUnfollow()
    }
  }
  return (
    <div className='flex items-center justify-between bg-white'>
      <div className='flex items-center space-x-4'>
        <div className='relative w-10 h-10'>
          <img src={profileImage} alt={`${username}'s avatar`} className='rounded-full' />
          {isVerified && (
            <div className='absolute bottom-0 right-0 bg-blue-500 rounded-full p-1'>
              <svg className='w-2 h-2 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
          )}
        </div>
        <div>
          <div className='flex items-center'>
            <p className='text-sm font-semibold'>{username}</p>
            {isVerified && (
              <svg className='w-5 h-5 ml-1 text-blue-500' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </div>
          <p className='text-sm text-gray-500'>{fullName}</p>
          {formattedFollowers && <p className='text-sm text-gray-500'>{formattedFollowers} người theo dõi</p>}
        </div>
      </div>
      <Button onClick={handleFollowToggle} className='border text-gray-800 font-semibold text-sm py-2 px-5 rounded-lg'>
        {isFollow ? t("following") : t("follow")}
      </Button>
    </div>
  )
}
