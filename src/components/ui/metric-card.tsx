import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const metricCardVariants = cva(
  "relative w-full rounded-xl border border-solid bg-background shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        trending: "border-border bg-gradient-to-b from-transparent to-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof metricCardVariants> {
  title?: string
  value?: string | number
  trend?: string
  trendIcon?: React.ReactNode
  subtitle?: string
  description?: string
  icon?: React.ReactNode
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ 
    className, 
    variant, 
    title = "Current BPM",
    value = "90", 
    trend = "+10.2%",
    trendIcon,
    subtitle = "Trending up this month",
    description = "Fido might be exercising currently",
    icon,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(metricCardVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-col items-start overflow-hidden p-6 rounded-inherit w-full h-full">
          <div className="flex flex-col gap-6 items-start w-full">
            {/* Header Section */}
            <div className="flex flex-col gap-1.5 items-start w-full">
              <div className="flex items-start justify-between w-full">
                <p className="text-sm font-normal text-muted-foreground whitespace-nowrap">
                  {title}
                </p>
                <div className="bg-background border border-border border-solid flex gap-1 items-center justify-center px-2 py-0.5 rounded-md">
                  {trendIcon || <TrendingUp className="w-3 h-3 text-[#164E63]" />}
                  <p className="text-xs font-semibold text-[#164E63] whitespace-nowrap">
                    {trend}
                  </p>
                </div>
              </div>
              <p className="text-3xl font-semibold text-[#164E63] w-full">
                {value}
              </p>
            </div>
            
            {/* Details Section */}
            <div className="flex flex-col gap-1.5 items-start w-full">
              <div className="flex gap-2 items-center w-full">
                <p className="text-sm font-normal text-foreground whitespace-nowrap">
                  {subtitle}
                </p>
                {icon || <TrendingUp className="w-4 h-6 text-[#164E63]" />}
              </div>
              <p className="text-sm font-normal text-muted-foreground whitespace-nowrap">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
MetricCard.displayName = "MetricCard"

export { MetricCard }