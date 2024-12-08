import Button from "../Button"
import Icon from "../Icon"

type ProfileCardProps = {
  name?: string
  username?: string
  bio?: string
  image?: string
  buttonText?: string
  icon?: React.ReactNode | JSX.Element
  disabledButton?: boolean
  onButtonClick?: () => void
  onCloseIcon?: () => void
}

export default function ProfileCard({
  name,
  username,
  bio,
  image,
  icon,
  buttonText,
  disabledButton,
  onCloseIcon,
  onButtonClick
}: ProfileCardProps) {
  return (
    <div className='relative bg-gray-50 rounded-lg shadow-md p-4 w-64 text-center flex flex-col justify-between items-center'>
      {image ? (
        <div className=' w-24 h-24 mx-auto mb-4'>
          <Icon
            name='X'
            width={14}
            className='text-gray-400 cursor-pointer absolute top-3 right-2'
            onClick={onCloseIcon}
          />
          <img src={image} alt='profile' className='rounded-full w-full h-full object-cover' />
        </div>
      ) : (
        <div className='flex items-center justify-center mb-2 bg-white w-16 h-16 rounded-full'>{icon}</div>
      )}
      <div className='text-black font-semibold text-lg'>{name}</div>
      <div className='text-gray-500 text-sm'>{username || bio}</div>
      <Button
        disabled={disabledButton}
        className='w-full bg-black text-white text-sm font-semibold rounded-lg mt-4 px-4 py-2 hover:bg-gray-800'
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  )
}
