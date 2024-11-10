import React from "react"

type ScrollContainerProps = {
  children: React.ReactNode
  className?: string
}

export const ScrollContainer: React.FC<ScrollContainerProps> = ({ children, className = "" }) => (
  <div className={`overflow-y-auto ${className}`}>{children}</div>
)
