/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { TabsList } from "@radix-ui/react-tabs"
import React from "react"

type TabListProps = {
  children: React.ReactNode
}

export default function TabList({ children }: TabListProps) {
  return <TabsList className='flex justify-between'>{children}</TabsList>
}
