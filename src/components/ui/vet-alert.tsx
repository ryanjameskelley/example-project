import * as React from "react"
import { Alert, AlertTitle, AlertDescription } from "./alert"
import { cn } from "@/lib/utils"

interface VetAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
}

const VetAlert = React.forwardRef<HTMLDivElement, VetAlertProps>(
  ({ className, title = "My Vet", description = "Connect and share vitals with your vet", icon, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        className={cn(
          "flex items-center gap-3 border-dashed px-4 py-3",
          className
        )}
        {...props}
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
            <div className="flex items-center justify-center w-full" style={{ gap: '10px' }}>
              {icon && (
                <div className="w-4 h-6 overflow-hidden flex-shrink-0">
                  {icon}
                </div>
              )}
              <AlertTitle className="text-sm font-medium text-foreground flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {title}
              </AlertTitle>
            </div>
            <AlertDescription className="text-sm font-normal text-muted-foreground w-full">
              {description}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    )
  }
)
VetAlert.displayName = "VetAlert"

export { VetAlert }