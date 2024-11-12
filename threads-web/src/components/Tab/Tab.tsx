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
        "px-[-40] py-2 text-gray-400 font-semibold text-sm w-full border-b",
        "data-[state=active]:border-b-black data-[state=active]:text-gray-800 "
      )}
    >
      {children}
    </TabsTrigger>
  )
}
