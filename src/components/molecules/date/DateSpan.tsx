import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Button } from "@/components/atoms/Button"
import { Calendar } from "@/components/atoms/calendar"
import { Field } from "@/components/atoms/Field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover"
import { cn } from "@/lib/utils"

// ─── Primitives ───────────────────────────────────────────────────────────────

export interface DateSpanValue {
  from: Date | undefined
  to?: Date | undefined
}

export interface DateSpanRootProps {
  value?: DateSpanValue
  onChange?: (value: DateSpanValue | undefined) => void
  children?: React.ReactNode
  className?: string
}

function DateSpanRoot({ value, onChange, children, className }: DateSpanRootProps) {
  const [internal, setInternal] = React.useState<DateRange | undefined>(
    value ? { from: value.from, to: value.to } : undefined
  )

  const date = value !== undefined ? { from: value.from, to: value.to } : internal

  const handleSelect = (range: DateRange | undefined) => {
    setInternal(range)
    onChange?.(range)
  }

  return (
    <DateSpanContext.Provider value={{ date, onSelect: handleSelect }}>
      <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>
    </DateSpanContext.Provider>
  )
}
DateSpanRoot.displayName = "DateSpanRoot"

// ─── Context ──────────────────────────────────────────────────────────────────

interface DateSpanContextValue {
  date: DateRange | undefined
  onSelect: (range: DateRange | undefined) => void
}

const DateSpanContext = React.createContext<DateSpanContextValue>({
  date: undefined,
  onSelect: () => {},
})

function useDateSpan() {
  return React.useContext(DateSpanContext)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DateSpanLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
    </label>
  )
}
DateSpanLabel.displayName = "DateSpanLabel"

function DateSpanTrigger({ id, className }: { id?: string; className?: string }) {
  const { date } = useDateSpan()
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        id={id}
        className={cn("justify-start px-2.5 font-normal", className)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} – {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date range</span>
        )}
      </Button>
    </PopoverTrigger>
  )
}
DateSpanTrigger.displayName = "DateSpanTrigger"

function DateSpanCalendar({ className }: { className?: string }) {
  const { date, onSelect } = useDateSpan()
  return (
    <PopoverContent className={cn("w-auto p-0", className)} align="start">
      <Calendar
        mode="range"
        defaultMonth={date?.from}
        selected={date}
        onSelect={onSelect}
        numberOfMonths={2}
      />
    </PopoverContent>
  )
}
DateSpanCalendar.displayName = "DateSpanCalendar"

// ─── Composed component ───────────────────────────────────────────────────────

export function DateSpan() {
  return (
    <Field label="Date Range" id="date-span-trigger">
      <Popover>
        <DateSpanRoot>
          <DateSpanTrigger id="date-span-trigger" className="w-60" />
          <DateSpanCalendar />
        </DateSpanRoot>
      </Popover>
    </Field>
  )
}

export {
  DateSpanRoot,
  DateSpanLabel,
  DateSpanTrigger,
  DateSpanCalendar,
  useDateSpan,
}
export type { DateRange }
