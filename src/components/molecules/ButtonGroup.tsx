import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

// Button Group Container
const buttonGroupVariants = cva(
  'inline-flex items-center',
  {
    variants: {
      variant: {
        default: '[&>*:not(:last-child)]:border-r-0 [&>*:first-child]:!rounded-r-none [&>*:last-child]:!rounded-l-none [&>*:not(:first-child):not(:last-child)]:!rounded-none',
        separated: 'gap-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonGroupVariants> {}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(buttonGroupVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
ButtonGroup.displayName = 'ButtonGroup'

export { ButtonGroup }
