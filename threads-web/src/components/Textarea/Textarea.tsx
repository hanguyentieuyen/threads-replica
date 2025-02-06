import { TextareaHTMLAttributes } from "react"
import { cn } from "~/lib/utils"
import { RegisterOptions, UseFormRegister } from "react-hook-form"
import React from "react"

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  errorMessage?: string
  classNameError?: string
  ref?: React.MutableRefObject<HTMLTextAreaElement | null>
}

export default function Textarea({
  ref,
  className,
  name,
  register,
  rules,
  errorMessage,
  classNameError = "text-sm text-red-600 mt-1 min-h-[1.25rem]",
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : null

  return (
    <>
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-5 w-full rounded-md border-solid border border-input-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:ring-primary focus:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...registerResult}
        {...rest}
      />
      {errorMessage && <div className={classNameError}>{errorMessage}</div>}
    </>
  )
}
