type AvatarProps = {
  name: string
  postedTime: string
  image: string
}
export default function PostAvatar({ name, image, postedTime }: AvatarProps) {
  return (
    <div className='flex items-center space-x-3'>
      <div className='relative'>
        <img className='w-10 h-10 rounded-full border-2 border-pink-500' src={image} alt='User avatar' />
        <div className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center'>
          <span className='text-xs font-bold'>+</span>
        </div>
      </div>
      <div className='flex items-center'>
        <span className='text-sm font-semibold mr-2'>{name}</span>
        <span className='text-sm text-gray-500'>{postedTime}</span>
      </div>
    </div>
  )
}
