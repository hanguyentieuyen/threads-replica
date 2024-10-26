type AvatarProps = {
  name: string
  postedTime: string
  image: string
}
export default function Avatar({ name, image, postedTime }: AvatarProps) {
  return (
    <div className='flex items-center space-x-3'>
      <div className='relative'>
        <img className='w-12 h-12 rounded-full border-2 border-pink-500' src={image} alt='User avatar' />
        <div className='absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center'>
          <span className='text-xs font-bold'>+</span>
        </div>
      </div>
      <div>
        <p className='text-sm font-semibold'>{name}</p>
        <p className='text-xs text-gray-500'>{postedTime}</p>
      </div>
    </div>
  )
}
