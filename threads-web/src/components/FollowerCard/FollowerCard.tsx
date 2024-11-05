import React from 'react'

type UserProfileCardProps = {
  username: string
  fullName: string
  followersCount: number
  profileImage: string
  isVerified?: boolean
}

export default function FollowerCard({
  username,
  fullName,
  followersCount,
  profileImage,
  isVerified = false
}: UserProfileCardProps) {
  const formattedFollowers = new Intl.NumberFormat('en-US', { notation: 'compact' }).format(followersCount)

  return (
    <div className='flex items-center justify-between p-4 bg-white rounded-lg shadow-md'>
      <div className='flex items-center space-x-4'>
        <div className='relative w-12 h-12'>
          <img src={profileImage} alt={`${username}'s avatar`} className='rounded-full' />
          {isVerified && (
            <div className='absolute bottom-0 right-0 bg-blue-500 rounded-full p-1'>
              <svg className='w-3 h-3 text-white' fill='currentColor' viewBox='0 0 20 20'>
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
            <h2 className='text-lg font-semibold'>{username}</h2>
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
          <p className='text-sm text-gray-500'>{formattedFollowers} người theo dõi</p>
        </div>
      </div>
      <button className='px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
        Theo dõi
      </button>
    </div>
  )
}
