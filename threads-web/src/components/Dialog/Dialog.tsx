import React from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  confirmText: string
  cancelText: string
  profileImage: string
}

export default function Dialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText,
  cancelText,
  profileImage
}: DialogProps) {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-2xl pt-6 px-0 w-80 text-center'>
        <img src={profileImage} alt='Profile' className='w-12 h-12 mx-auto rounded-full' />
        <p className='mt-4 text-lg font-medium'>{title}</p>
        <div className='flex items-center justify-between mt-6 border-t border-gray-200'>
          <button
            onClick={onClose}
            className='w-1/2 py-3 text-gray-700 hover:bg-gray-100 rounded-l-lg border-r border-gray-200'
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} className='w-1/2 py-3 text-red-600 font-semibold hover:bg-red-100 rounded-r-lg'>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Example usage
export function DialogExample() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleConfirm = () => {
    console.log('Confirmed')
    setIsDialogOpen(false)
  }

  return (
    <div className='p-4'>
      <button
        onClick={() => setIsDialogOpen(true)}
        className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'
      >
        Open Dialog
      </button>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
        title='Bỏ theo dõi advertisingvietnam?'
        confirmText='Bỏ theo dõi'
        cancelText='Hủy'
        profileImage='#'
      />
    </div>
  )
}
