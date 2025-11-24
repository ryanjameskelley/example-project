import * as React from "react"
import { Button, type ButtonProps } from "../atoms/Button"
import { cn } from "../lib/utils"

export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: "horizontal" | "vertical"
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, children, orientation = "horizontal", ...props }, ref) => {
    const isHorizontal = orientation === "horizontal"
    
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          isHorizontal ? "flex-row" : "flex-col",
          "[&>button]:rounded-none",
          isHorizontal ? 
            "[&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:first-child)]:border-l-0" :
            "[&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:first-child)]:border-t-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }