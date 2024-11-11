import { TabsList } from "@radix-ui/react-tabs"
import React from "react"

type TabListProps = {
  children: React.ReactNode
}

export default function TabList({ children }: TabListProps) {
  return <TabsList className='flex border-b border-gray-200'>{children}</TabsList>
}
