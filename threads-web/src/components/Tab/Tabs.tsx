/**
 * 🐱 Author: HaYen <hanguyentieuyen@gmail.com>
 * 🍀 Made with ❤️ and ☕ by hanguyentieuyen
 * 🏠 [Repo](https://github.com/hanguyentieuyen/threads-replica)
 */

import React from "react"
import TabList from "./TabList"
import Tab from "./Tab"
import TabPanel from "./TabPanel"
import { Tabs as RadixTabs } from "@radix-ui/react-tabs"
type TabsProps = {
  defaultValue: string
  tabs: { value: string; label: string; content: React.ReactNode }[]
}

export default function Tabs({ defaultValue, tabs }: TabsProps) {
  return (
    <RadixTabs defaultValue={defaultValue} className='w-full'>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value}>
            {tab.label}
          </Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.value} value={tab.value}>
          {tab.content}
        </TabPanel>
      ))}
    </RadixTabs>
  )
}
