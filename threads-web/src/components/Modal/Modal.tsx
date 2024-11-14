import { X } from "lucide-react"
import { useState, useContext, createContext } from "react"

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

export function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return <ModalContext.Provider value={{ isOpen, setIsOpen }}>{children}</ModalContext.Provider>
}

export function ModalTrigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen } = useModalContext()
  return (
    <div className='px-4 py-2 bg-slate-300 text-white rounded hover:bg-slate-400' onClick={() => setIsOpen(true)}>
      {children}
    </div>
  )
}

export function ModalContent({ children }: { children: React.ReactNode }) {
  const { isOpen, setIsOpen } = useModalContext()
  if (!isOpen) return null
  return (
    <div className='fixed insert-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'>
      <div className='relative w-full max-w-md bg-white rounded-lg shadow-lg'>
        <button onClick={() => setIsOpen(false)} className='absolute top-2 right-2 text-gray-400 hover:text-gray-600'>
          <X width={24} />
        </button>
        <div className='p-6'>{children}</div>
      </div>
    </div>
  )
}

export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className='mb-4'>{children}</div>
}

export function ModalDescription({ children }: { children: React.ReactNode }) {
  return <div className='w-full'>{children}</div>
}

export default function ModalExample() {
  return (
    <Modal>
      <ModalTrigger>Open modal</ModalTrigger>
      <ModalContent>
        <ModalHeader>Are you sure ?</ModalHeader>
        <ModalDescription>Test modal</ModalDescription>
      </ModalContent>
    </Modal>
  )
}
