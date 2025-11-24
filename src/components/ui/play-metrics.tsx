import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const playMetricsVariants = cva(
  "relative bg-card border border-solid border-border rounded-xl shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface PlayMetricsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof playMetricsVariants> {
  title?: string
  value?: string | number
  average?: string
  icon?: React.ReactNode
}

const PlayMetrics = React.forwardRef<HTMLDivElement, PlayMetricsProps>(
  ({ 
    className, 
    variant, 
    title = "BPM",
    value = "90", 
    average = "65 Avg",
    icon,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(playMetricsVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-col items-start overflow-hidden px-6 py-4 rounded-inherit w-full" style={{ gap: '8px' }}>
          {/* Header Section */}
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-medium text-foreground whitespace-nowrap">
              {title}
            </p>
            {icon && (
              <div className="w-4 h-4 flex-shrink-0 text-muted-foreground" style={{ height: '16px' }}>
                {icon}
              </div>
            )}
          </div>
          
          {/* Value Section */}
          <div className="flex flex-col items-start w-full">
            <div className="h-8 w-full">
              <p className="text-2xl font-bold text-foreground leading-8 mb-0">
                {value}
              </p>
            </div>
            <p className="text-xs font-normal text-muted-foreground w-full mt-0">
              {average}
            </p>
          </div>
        </div>
      </div>
    )
  }
)
PlayMetrics.displayName = "PlayMetrics"

export { PlayMetrics }