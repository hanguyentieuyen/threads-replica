import { TabsTrigger } from "@radix-ui/react-tabs"
import React from "react"
import { cn } from "~/lib/utils"

type TabProps = {
  value: string
  children: React.ReactNode
}
export default function Tab({ value, children }: TabProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        "px-4 py-2 font-medium text-gray-700 hover:text-blue-600",
        "data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
      )}
    >
      {children}
    </TabsTrigger>
  )
}
