import * as LucideIcons from "lucide-react"
import React from "react"

type LucideIconType = React.ComponentType<React.ComponentProps<"svg"> & { size?: number | string }>

export type IconName = Extract<keyof typeof LucideIcons, string>

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: number | string
  color?: string
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = "currentColor", className, ...props }) => {
  const LucideIcon = LucideIcons[name] as LucideIconType

  if (!LucideIcon) {
    console.warn(`Lucide icon "${name}" does not exist.`)
    return null
  }

  return <LucideIcon size={size} color={color} className={className} {...props} />
}

export default Icon
