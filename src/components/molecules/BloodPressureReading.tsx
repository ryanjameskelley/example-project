import * as React from 'react'
import { Button } from '@/components/atoms/Button'
import { Field } from '@/components/atoms/Field'
import { Switch } from '@/components/atoms/switch'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Input } from '@/components/atoms/input'
import { DateTimeRoot, DateTimePicker, DateTimeTimePicker } from '@/components/molecules/date/DateTime'
import { cn } from '@/lib/utils'

type MedStatus = 'Unknown' | 'Before Meds' | 'After Meds'

export interface BloodPressureReadingProps {
  onSave?: (data: BloodPressureReadingData) => void
  onCancel?: () => void
  className?: string
}

export interface BloodPressureReadingData {
  timestamp: string
  timeIsEstimated: boolean
  medStatus: MedStatus
  irregularHeartbeat: boolean
  sbp: string
  dbp: string
  heartRate: string
}

export function BloodPressureReading({ onSave, onCancel, className }: BloodPressureReadingProps) {
  const now = new Date()
  const [bpDate, setBpDate] = React.useState<Date | undefined>(now)
  const [bpTime, setBpTime] = React.useState(
    now.toTimeString().slice(0, 5)
  )
  const [timeIsEstimated, setTimeIsEstimated] = React.useState(false)
  const [medStatus, setMedStatus] = React.useState<MedStatus>('Unknown')
  const [irregularHeartbeat, setIrregularHeartbeat] = React.useState(false)
  const [sbp, setSbp] = React.useState('')
  const [dbp, setDbp] = React.useState('')
  const [heartRate, setHeartRate] = React.useState('')
  const [errors, setErrors] = React.useState<{ sbp?: string; dbp?: string }>({})

  const medOptions: MedStatus[] = ['Before Meds', 'After Meds', 'Unknown']

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newErrors: { sbp?: string; dbp?: string } = {}
    if (!sbp) newErrors.sbp = 'SBP is required'
    if (!dbp) newErrors.dbp = 'DBP is required'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const timestamp = bpDate
      ? `${bpDate.toISOString().slice(0, 10)}T${bpTime}`
      : bpTime
    onSave?.({ timestamp, timeIsEstimated, medStatus, irregularHeartbeat, sbp, dbp, heartRate })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-5 p-4 overflow-y-auto', className)}
    >
      {/* Timestamp */}
      <DateTimeRoot
        defaultDate={bpDate}
        defaultTime={bpTime}
        onDateChange={setBpDate}
        onTimeChange={setBpTime}
      >
        <DateTimePicker id="bp-date" label="Date" />
        <DateTimeTimePicker id="bp-time" label="Time" />
      </DateTimeRoot>

      {/* Time is estimated */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="bp-estimated"
          checked={timeIsEstimated}
          onCheckedChange={(v) => setTimeIsEstimated(v === true)}
        />
        <label htmlFor="bp-estimated" className="text-sm font-medium text-foreground cursor-pointer">
          Time is estimated
        </label>
      </div>

      {/* Medication status */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Medication Status</span>
        <div className="flex gap-2">
          {medOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setMedStatus(opt)}
              className={cn(
                'flex-1 h-8 rounded-[10px] border text-sm transition-colors',
                medStatus === opt
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-input hover:bg-muted'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Irregular heartbeat */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Irregular Heartbeat Detected (for BPM)</span>
        <Switch
          checked={irregularHeartbeat}
          onCheckedChange={setIrregularHeartbeat}
        />
      </div>

      {/* SBP */}
      <Field label="SBP (Systolic)" id="bp-sbp" required error={errors.sbp}>
        <Input
          id="bp-sbp"
          type="number"
          placeholder="e.g. 120"
          value={sbp}
          onChange={(e) => { setSbp(e.target.value); setErrors((p) => ({ ...p, sbp: undefined })) }}
          className="h-8 rounded-[10px] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:ring-offset-0"
        />
      </Field>

      {/* DBP */}
      <Field label="DBP (Diastolic)" id="bp-dbp" required error={errors.dbp}>
        <Input
          id="bp-dbp"
          type="number"
          placeholder="e.g. 80"
          value={dbp}
          onChange={(e) => { setDbp(e.target.value); setErrors((p) => ({ ...p, dbp: undefined })) }}
          className="h-8 rounded-[10px] focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:ring-offset-0"
        />
      </Field>

      {/* Heart rate */}
      <Field label="Heart Rate (BPM)" id="bp-hr">
        <Input
          id="bp-hr"
          type="number"
          placeholder="e.g. 72"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
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
