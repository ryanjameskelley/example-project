import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[10px] font-sans text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-black/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        muted: "bg-muted text-muted-foreground hover:bg-muted/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-red-50 text-red-600 hover:bg-red-100",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-2",
        sm: "h-7 px-1.5 text-xs",
        lg: "h-10 px-2.5",
        icon: "h-8 w-8",
      },
      rounded: {
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // Only apply gap when there are multiple visual elements (icons + children)
    const hasMultipleElements =
      (loading || leftIcon || rightIcon) && (children || (loading && (leftIcon || rightIcon)))

    const content = (
      <>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
      </>
    )

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, rounded }),
          hasMultipleElements && "gap-2",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading ? "true" : undefined}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
