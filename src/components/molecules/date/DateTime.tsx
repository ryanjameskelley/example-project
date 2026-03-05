import * as React from "react"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/atoms/Button"
import { Calendar } from "@/components/atoms/calendar"
import { Field } from "@/components/atoms/Field"
import { Input } from "@/components/atoms/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover"
import { cn } from "@/lib/utils"

// ─── Context ──────────────────────────────────────────────────────────────────

interface DateTimeContextValue {
  date: Date | undefined
  time: string
  setDate: (d: Date | undefined) => void
  setTime: (t: string) => void
  open: boolean
  setOpen: (o: boolean) => void
}

const DateTimeContext = React.createContext<DateTimeContextValue>({
  date: undefined,
  time: "10:30",
  setDate: () => {},
  setTime: () => {},
  open: false,
  setOpen: () => {},
})

function useDateTime() {
  return React.useContext(DateTimeContext)
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DateTimeRootProps {
  defaultDate?: Date
  defaultTime?: string
  onDateChange?: (date: Date | undefined) => void
  onTimeChange?: (time: string) => void
  children?: React.ReactNode
  className?: string
}

function DateTimeRoot({
  defaultDate,
  defaultTime = "10:30",
  onDateChange,
  onTimeChange,
  children,
  className,
}: DateTimeRootProps) {
  const [date, setDateInternal] = React.useState<Date | undefined>(defaultDate)
  const [time, setTimeInternal] = React.useState(defaultTime)
  const [open, setOpen] = React.useState(false)

  const setDate = (d: Date | undefined) => {
    setDateInternal(d)
    onDateChange?.(d)
  }
  const setTime = (t: string) => {
    setTimeInternal(t)
    onTimeChange?.(t)
  }

  return (
    <DateTimeContext.Provider value={{ date, time, setDate, setTime, open, setOpen }}>
      <div className={cn("flex flex-row gap-2 items-end", className)}>{children}</div>
    </DateTimeContext.Provider>
  )
}
DateTimeRoot.displayName = "DateTimeRoot"

// ─── Date picker part ─────────────────────────────────────────────────────────

export interface DateTimePickerProps {
  id?: string
  label?: string
  className?: string
}

function DateTimePicker({ id = "date-picker", label = "Date", className }: DateTimePickerProps) {
  const { date, setDate, open, setOpen } = useDateTime()
  return (
    <Field label={label} id={id} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="w-32 justify-between font-normal"
          >
            {date ? format(date, "MMM d, y") : "Select date"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            onSelect={(d) => {
              setDate(d)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
DateTimePicker.displayName = "DateTimePicker"

// ─── Time picker part ─────────────────────────────────────────────────────────

export interface DateTimeTimePickerProps {
  id?: string
  label?: string
  className?: string
}

function DateTimeTimePicker({
  id = "time-picker",
  label = "Time",
  className,
}: DateTimeTimePickerProps) {
  const { time, setTime } = useDateTime()
  return (
    <Field label={label} id={id} className={cn("w-32", className)}>
      <Input
        type="time"
        id={id}
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden h-8 rounded-[10px] shadow-none focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:ring-offset-0"
      />
    </Field>
  )
}
DateTimeTimePicker.displayName = "DateTimeTimePicker"

// ─── Composed component ───────────────────────────────────────────────────────

export function DateTime() {
  return (
    <DateTimeRoot>
      <DateTimePicker />
      <DateTimeTimePicker />
    </DateTimeRoot>
  )
}

export {
  DateTimeRoot,
  DateTimePicker,
  DateTimeTimePicker,
  useDateTime,
}
