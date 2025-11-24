import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconTabsVariants = cva(
  "inline-flex gap-1 items-start overflow-hidden p-1 rounded-lg bg-white",
  {
    variants: {
      variant: {
        default: "bg-white",
      },
      size: {
        default: "p-1",
        sm: "p-0.5",
        lg: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const iconTabTriggerVariants = cva(
  "inline-flex items-center justify-center gap-2 h-9 px-2 py-2.5 rounded-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-accent data-[state=active]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface IconTabsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof iconTabsVariants> {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface IconTabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof iconTabTriggerVariants> {
  value: string
  children: React.ReactNode
}

const IconTabsContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

const IconTabs = React.forwardRef<HTMLDivElement, IconTabsProps>(
  ({ className, variant, size, value, onValueChange, children, ...props }, ref) => {
    return (
      <IconTabsContext.Provider value={{ value, onValueChange }}>
        <div
          ref={ref}
          className={cn(iconTabsVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </div>
      </IconTabsContext.Provider>
    )
  }
)
IconTabs.displayName = "IconTabs"

const IconTabTrigger = React.forwardRef<HTMLButtonElement, IconTabTriggerProps>(
  ({ className, variant, value: triggerValue, children, ...props }, ref) => {
    const { value, onValueChange } = React.useContext(IconTabsContext)
    const isActive = value === triggerValue

    return (
      <button
        ref={ref}
        className={cn(iconTabTriggerVariants({ variant }), className)}
        data-state={isActive ? "active" : "inactive"}
        onClick={() => onValueChange?.(triggerValue)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
IconTabTrigger.displayName = "IconTabTrigger"

export { IconTabs, IconTabTrigger }