import { useState, useContext, createContext, forwardRef, useImperativeHandle } from "react"
import Icon from "../Icon"

type ModalContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContext = createContext<ModalContextType | null>(null)

const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("Modal components must be used within ModalProvider")
  }
  return context
}

export const Modal = forwardRef(({ children }: { children: React.ReactNode }, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }))

  return <ModalContext.Provider value={{ isOpen, setIsOpen }}>{children}</ModalContext.Provider>
})

export function ModalTrigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useModalContext()
  return (
    <div className='w-full' onClick={() => setIsOpen(true)}>
      {children}
    </div>
  )
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useModalContext()
  if (!isOpen) return null

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }
  return (
    <div
      onClick={handleClose}
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity'
    >
      <div className='relative w-full max-w-md bg-white rounded-lg shadow-lg'>
        <button onClick={() => setIsOpen(false)} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
          <Icon name='X' width={20} />
        </button>
        <div className='p-2'>{children}</div>
      </div>
    </div>
  )
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className='mb-4 font-bold text-lg'>{children}</div>
}

export function ModalDescription({ children }: { children: React.ReactNode }) {
  return <div className='text-sm text-gray-600'>{children}</div>
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className='mt-4 flex justify-end space-x-2'>{children}</div>
}
