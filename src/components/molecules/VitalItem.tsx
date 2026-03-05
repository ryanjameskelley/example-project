import * as React from 'react'
import { HeartPulse, Weight, Droplets, Activity } from 'lucide-react'
import { SegmentedBadge } from '@/components/atoms/SegmentedBadge'
import { Badge } from '@/components/atoms/Badge'
import { cn } from '@/lib/utils'

export type VitalReadingType = 'blood-pressure' | 'weight' | 'glucose' | 'heart-rate' | 'other'
export type VitalStatus = 'success' | 'warning' | 'error' | 'alert'

export interface VitalItemSegment {
  value: string | number
  unit: string
  status: VitalStatus
}

export interface VitalItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  timestamp: Date | string
  timestampIsEstimated?: boolean
  readingType?: VitalReadingType
  segments: VitalItemSegment[]
  source?: string
  flags?: string[]
  reviewed?: boolean
}

const readingTypeConfig: Record<VitalReadingType, { icon: React.ElementType; color: string }> = {
  'blood-pressure': { icon: Activity, color: 'bg-red-100 text-red-600' },
  'weight': { icon: Weight, color: 'bg-blue-100 text-blue-600' },
  'glucose': { icon: Droplets, color: 'bg-orange-100 text-orange-600' },
  'heart-rate': { icon: HeartPulse, color: 'bg-pink-100 text-pink-600' },
  'other': { icon: HeartPulse, color: 'bg-gray-100 text-gray-600' },
}

function formatTimestamp(ts: Date | string): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export const VitalItem = React.forwardRef<HTMLDivElement, VitalItemProps>(
  ({ name, timestamp, timestampIsEstimated, readingType = 'other', segments, source, flags, reviewed, className, ...props }, ref) => {
    const { icon: Icon, color } = readingTypeConfig[readingType]

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-3',
          className
        )}
        {...props}
      >
        {/* Type icon */}
        <div className={cn('hidden sm:flex h-8 w-8 rounded-full items-center justify-center flex-shrink-0', color)}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Left col: name + subtitle + flags */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground truncate">{name}</span>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-muted-foreground">
              {timestampIsEstimated && <span title="Estimated time">~ </span>}{formatTimestamp(timestamp)}
              {source && <> · {source}</>}
              {flags && flags.length > 0 && <> · </>}
            </span>
            {reviewed && (
              <div className="h-2 w-2 rounded-full bg-green-400 flex-shrink-0" title="Reviewed" />
            )}
            {flags && flags.map((flag) => (
              <Badge key={flag} variant="outline" className="text-[10px] px-1.5 py-0">
                {flag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Segmented badge — vertically centered with the item */}
        <div className="flex-shrink-0">
          <SegmentedBadge segments={segments} />
        </div>
      </div>
    )
  }
)
VitalItem.displayName = 'VitalItem'
