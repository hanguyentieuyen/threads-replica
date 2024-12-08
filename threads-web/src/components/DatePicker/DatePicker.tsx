import React from "react"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { Button } from "../../components/ui/button"

import { format } from "date-fns"
import { cn } from "../../lib/utils"
import { RegisterOptions, UseFormRegister, UseFormSetValue } from "react-hook-form"
import Icon from "../Icon"

type DatePickerProps = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  errorMessage?: string
  classNameError?: string
}

export default function DatePicker({
  name,
  setValue,
  className,
  classNameError = "text-sm text-red-600 mt-1 min-h-[1.25rem]",
  errorMessage,
  register,
  rules
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const registerResult = register && name ? register(name, rules) : null

  // Update both component state and form context on date select
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setValue(name, selectedDate) // Update form value
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "bg-[#f5f5f5] w-full py-4 rounded-xl outline-none text-left",
            className,
            { "text-muted-foreground": !date } // Apply "text-muted-foreground" only if `!date` is true
          )}
          {...registerResult}
        >
          <Icon name='CalendarIcon' className='mr-2 h-4 w-4' />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className=' w-auto p-0'>
        <Calendar
          mode='single'
          captionLayout='dropdown-buttons'
          selected={date}
          onSelect={handleDateSelect}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
      {errorMessage && <p className={cn("text-red-500 mt-1", classNameError)}>{errorMessage}</p>}
    </Popover>
  )
}
