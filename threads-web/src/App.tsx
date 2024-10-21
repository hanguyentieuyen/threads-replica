import React from 'react'
import './App.css'
import { Calendar } from './components/ui/calendar'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover'
import { Button } from './components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from './lib/utils'
function App() {
  const routerElements = useRouteElement()
  const [date, setDate] = React.useState<Date>()
  return (
    <>
      {routerElements}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className=' w-auto p-0'>
          <Calendar
            mode='single'
            captionLayout='dropdown-buttons'
            selected={date}
            onSelect={setDate}
            fromYear={1960}
            toYear={2030}
          />
        </PopoverContent>
      </Popover>
      <ToastContainer />
    </>
  )
}

export default App
