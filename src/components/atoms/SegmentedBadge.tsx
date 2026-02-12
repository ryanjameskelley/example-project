import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const segmentVariants = cva(
  "inline-flex flex-col items-center justify-center px-2.5 py-0.5 first:rounded-l-[10px] last:rounded-r-[10px]",
  {
    variants: {
      status: {
        success: "bg-green-50 text-green-700 border-green-200",
        warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
        error: "bg-red-50 text-red-700 border-red-200",
        alert: "bg-orange-100 text-orange-700 border-orange-300",
      },
    },
    defaultVariants: {
      status: "success",
    },
  }
)

export interface SegmentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof segmentVariants> {
  value: string | number
  unit: string
}

const Segment = React.forwardRef<HTMLDivElement, SegmentProps>(
  ({ className, status, value, unit, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(segmentVariants({ status }), className)}
        {...props}
      >
        <span className="text-xs font-medium leading-none">{value}</span>
        <span className="text-[10px] leading-none mt-0.5">{unit}</span>
      </div>
    )
  }
)
Segment.displayName = "Segment"

export interface SegmentedBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  segments: Array<{
    value: string | number
    unit: string
    status: "success" | "warning" | "error" | "alert"
  }>
}

const SegmentedBadge = React.forwardRef<HTMLDivElement, SegmentedBadgeProps>(
  ({ className, segments, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-stretch border rounded-[10px] overflow-hidden", className)}
        {...props}
      >
        {segments.map((segment, index) => (
          <Segment
            key={index}
            value={segment.value}
            unit={segment.unit}
            status={segment.status}
          />
        ))}
      </div>
    )
  }
)
SegmentedBadge.displayName = "SegmentedBadge"

export { SegmentedBadge, Segment, segmentVariants }
