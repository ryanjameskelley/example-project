import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const itemVariants = cva(
  'flex items-center gap-2 rounded-[10px] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-none bg-transparent',
        outline: 'border border-[color:lab(90.952_0_-0.0000119209)]',
        muted: 'border-none bg-[color:lab(96.476_0_-0.00000596046)]',
        destructive: 'border-none bg-[color:oklab(0.57701_0.217634_0.112472/0.1)]',
      },
      size: {
        default: 'py-2.5 px-3',
        sm: 'py-2 px-2.5',
        lg: 'py-3 px-3.5',
      },
      clickable: {
        true: 'cursor-pointer hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      clickable: false,
    },
  }
)

export interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {
  asChild?: boolean
  clickable?: boolean
}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, clickable = false, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div'
    return (
      <Comp
        ref={ref}
        className={cn(itemVariants({ variant, size, clickable, className }))}
        {...props}
      />
    )
  }
)
Item.displayName = 'Item'

const ItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-0', className)}
      {...props}
    />
  )
})
ItemGroup.displayName = 'ItemGroup'

const ItemSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('h-px bg-[color:lab(90.952_0_-0.0000119209)]', className)}
      {...props}
    />
  )
})
ItemSeparator.displayName = 'ItemSeparator'

const itemMediaVariants = cva('flex items-center [&>svg]:h-4 [&>svg]:w-4', {
  variants: {
    variant: {
      default: '',
      icon: 'text-[color:lab(48.496_0_0)]',
      'icon-destructive': 'text-red-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ItemMediaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemMediaVariants> {}

const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(itemMediaVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
ItemMedia.displayName = 'ItemMedia'

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex flex-1 flex-col gap-1 justify-center self-stretch', className)}
      {...props}
    />
  )
})
ItemContent.displayName = 'ItemContent'

export interface ItemTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: 'default' | 'destructive'
}

const ItemTitle = React.forwardRef<HTMLHeadingElement, ItemTitleProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none',
          variant === 'destructive'
            ? 'text-red-600'
            : 'text-[color:lab(15.204_0_-0.00000596046)]',
          className
        )}
        {...props}
      />
    )
  }
)
ItemTitle.displayName = 'ItemTitle'

export interface ItemDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'destructive'
}

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  ItemDescriptionProps
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        'text-sm font-light leading-normal',
        variant === 'destructive'
          ? 'text-red-600'
          : 'text-[color:lab(48.496_0_0)]',
        className
      )}
      {...props}
    />
  )
})
ItemDescription.displayName = 'ItemDescription'

const ItemActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
})
ItemActions.displayName = 'ItemActions'

const ItemHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-between gap-2', className)}
      {...props}
    />
  )
})
ItemHeader.displayName = 'ItemHeader'

const ItemFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  )
})
ItemFooter.displayName = 'ItemFooter'

export {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
}
