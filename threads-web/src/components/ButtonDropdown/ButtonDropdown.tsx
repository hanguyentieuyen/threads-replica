import React, { useState } from 'react'

type ButtonProps = {
  label: string
  onClick: () => void
}

type DropdownMenuProps = {
  items: string[]
  onSelect: (item: string) => void
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label} ▼</button>
}

function DropdownMenu({ items, onSelect }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleItemClick = (item: string) => {
    onSelect(item)
    setIsOpen(false)
  }

  return (
    <div className='dropdown'>
      <button onClick={() => setIsOpen(!isOpen)}>Options ▼</button>
      {isOpen && (
        <ul className='dropdown-menu'>
          {items.map((item) => (
            <li key={item} onClick={() => handleItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function DropdownButton() {
  const [selectedValue, setSelectedValue] = useState('Dành cho bạn')

  const items = ['Dành cho bạn', 'Đang theo dõi', 'Đã thích', 'Đã lưu', 'Tạo bảng feed mới', 'tech']

  return (
    <div>
      <Button label={selectedValue} onClick={() => {}} />
      <DropdownMenu items={items} onSelect={(item) => setSelectedValue(item)} />
    </div>
  )
}

export default DropdownButton
