import { useState } from 'react'

type Item = {
  label: string
  href: string
  active: boolean
}

type DropdownProps = {
  title: string
  items: Item[]
  icon: string
}

const Dropdown = ({ title, items, icon }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  return (
    <div className='relative inline-block text-left'>
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className='flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 focus:outline-none'
      >
        {title}
        <svg
          className='ml-2 h-5 w-5 text-gray-400'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06-.02L10 10.58l3.71-3.4a.75.75 0 011.06.02.75.75 0 01-.02 1.06l-4 3.75a.75.75 0 01-1.06 0l-4-3.75a.75.75 0 01-.02-1.06z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='menu-button'>
            {items.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center ${
                  item.active ? 'font-semibold' : ''
                }`}
                role='menuitem'
              >
                {item.label}
                {item.active && <span className='text-green-500'>✔</span>}
              </a>
            ))}
            <div className='border-t border-gray-200'></div>
            <a
              href='#'
              className='flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 justify-between items-center'
              role='menuitem'
            >
              {icon ? icon : 'Default Icon'}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dropdown
