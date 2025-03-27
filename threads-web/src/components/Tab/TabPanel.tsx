/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import { TabsContent } from "@radix-ui/react-tabs"
import React from "react"

type TabPanelProps = {
  value: string
  children: React.ReactNode
}
export default function TabPanel({ value, children }: TabPanelProps) {
  return (
    <TabsContent value={value} className='p-4 text-gray-700 bg-white'>
      {children}
    </TabsContent>
  )
}
