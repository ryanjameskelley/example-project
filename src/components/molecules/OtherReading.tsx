import * as React from 'react'
import { Button } from '@/components/atoms/Button'
import { Field } from '@/components/atoms/Field'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Input } from '@/components/atoms/input'
import { DateTimeRoot, DateTimePicker, DateTimeTimePicker } from '@/components/molecules/date/DateTime'
import { cn } from '@/lib/utils'

export interface OtherReadingProps {
  onSave?: (data: OtherReadingData) => void
  onCancel?: () => void
  className?: string
}

export interface OtherReadingData {
  timestamp: string
  timeIsEstimated: boolean
  value: string
  unit: string
}

export function OtherReading({ onSave, onCancel, className }: OtherReadingProps) {
  const now = new Date()
  const [readingDate, setReadingDate] = React.useState<Date | undefined>(now)
  const [readingTime, setReadingTime] = React.useState(now.toTimeString().slice(0, 5))
  const [timeIsEstimated, setTimeIsEstimated] = React.useState(false)
  const [value, setValue] = React.useState('')
  const [unit, setUnit] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const timestamp = readingDate
      ? `${readingDate.toISOString().slice(0, 10)}T${readingTime}`
      : readingTime
    onSave?.({ timestamp, timeIsEstimated, value, unit })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-5 p-4 overflow-y-auto', className)}
    >
      {/* Timestamp */}
      <DateTimeRoot
        defaultDate={readingDate}
        defaultTime={readingTime}
        onDateChange={setReadingDate}
        onTimeChange={setReadingTime}
      >
        <DateTimePicker id="or-date" label="Date" />
        <DateTimeTimePicker id="or-time" label="Time" />
      </DateTimeRoot>

      {/* Time is estimated */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="or-estimated"
          checked={timeIsEstimated}
          onCheckedChange={(v) => setTimeIsEstimated(v === true)}
        />
        <label htmlFor="or-estimated" className="text-sm font-medium text-foreground cursor-pointer">
          Time is estimated
        </label>
      </div>

      {/* Value */}
      <Field label="Value" id="or-value">
        <Input
          id="or-value"
          type="text"
          placeholder="e.g. 98.6"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-8 rounded-[10px] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:ring-offset-0"
        />
      </Field>

      {/* Unit */}
      <Field label="Unit" id="or-unit">
        <Input
          id="or-unit"
          type="text"
          placeholder="e.g. °F, mg/dL, lbs"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="h-8 rounded-[10px] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:ring-offset-0"
        />
      </Field>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1">Save readings</Button>
      </div>
    </form>
  )
}
