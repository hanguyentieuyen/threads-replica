import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../Dropdown/Dropdown"
import { ChevronDown } from "lucide-react"

export default function HeaderContainer() {
  const [isChecked, setIsChecked] = useState(false)
  return (
    <div className='max-w-2xl mx-auto flex items-center justify-center h-[60px] bg-slate-50'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <ChevronDown size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>option 1</DropdownMenuItem>
          <DropdownMenuCheckboxItem checked={isChecked} onCheckedChange={setIsChecked}>
            Checkbox Item
          </DropdownMenuCheckboxItem>
          <DropdownMenuSubTrigger>Submenu Trigger</DropdownMenuSubTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
