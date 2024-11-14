import { useState, createContext, useContext, ReactNode, forwardRef, HTMLProps } from "react"

type DropdownMenuContextType = { isOpen: boolean; toggleOpen: () => void }
const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined)

const useDropdownMenuContext = () => {
  const context = useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("Dropdown subcomponents must be used within Dropdown")
  }
  return context
}

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen((prev) => !prev)

  return (
    <DropdownMenuContext.Provider value={{ isOpen, toggleOpen }}>
      <div className='relative'>{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export const DropdownMenuTrigger = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const { toggleOpen } = useDropdownMenuContext()
    return (
      <div
        ref={ref}
        onClick={toggleOpen}
        className='inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md focus:outline-none focus:ring'
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

export const DropdownMenuContent = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    const { isOpen } = useDropdownMenuContext()
    if (!isOpen) return null

    return (
      <div ref={ref} className='absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg' {...props}>
        {children}
      </div>
    )
  }
)
DropdownMenuContent.displayName = "DropdownMenuContent"

export const DropdownMenuLabel = ({ children }: { children: ReactNode }) => (
  <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase'>{children}</div>
)

export const DropdownMenuSeparator = () => <div className='border-t border-gray-200 my-2' />

export const DropdownMenuItem = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(({ children, ...props }, ref) => (
  <div
    ref={ref}
    className='flex items-center px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100'
    {...props}
  >
    {children}
  </div>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

interface DropdownMenuCheckboxItemProps extends HTMLProps<HTMLDivElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}
export const DropdownMenuCheckboxItem = ({
  children,
  checked,
  onCheckedChange,
  ...props
}: DropdownMenuCheckboxItemProps) => (
  <div
    className={`flex items-center px-4 py-2 text-sm cursor-pointer ${
      checked ? "text-blue-600" : "text-gray-700"
    } hover:bg-gray-100`}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    {...props}
  >
    <input type='checkbox' checked={checked} readOnly className='mr-2 rounded' />
    {children}
  </div>
)

export const DropdownMenuSubTrigger = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div
      ref={ref}
      className='flex items-center px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100'
      {...props}
    >
      {children}
      <span className='ml-auto'>&gt;</span>
    </div>
  )
)
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"
