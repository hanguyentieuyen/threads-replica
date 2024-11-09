import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../Dropdown/Dropdown"
import { ChevronDown } from "lucide-react"
import Button from "../Button"
const dropdownItems = ["Dành cho bạn", "option 2", "option 3", "option 4", "option 5"]
export default function HeaderContainer() {
  const [isChecked, setIsChecked] = useState(false)
  const [labelBtn, setLabelBtn] = useState<string>(dropdownItems[0])
  const handleSelectItem = (item: string) => {
    setLabelBtn(item)
  }
  return (
    <div className='max-w-2xl mx-auto flex items-center justify-center h-[60px] bg-slate-50'>
      <Button className='min-w-28 font-semibold text-gray-700 text-sm'>{labelBtn}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='w-6 h-6 bg-white rounded-full flex justify-center items-center border shadow-sm cursor-pointer'>
            <ChevronDown size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {dropdownItems.map((dropdownItem, index) => (
            <DropdownMenuItem key={index} onClick={() => handleSelectItem(dropdownItem)}>
              {dropdownItem}
            </DropdownMenuItem>
          ))}
          <DropdownMenuCheckboxItem checked={isChecked} onCheckedChange={setIsChecked}>
            Checkbox Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuSubTrigger>Submenu Trigger</DropdownMenuSubTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
