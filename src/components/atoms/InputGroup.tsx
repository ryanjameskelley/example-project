import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-8 rounded-[10px] border border-input bg-background overflow-hidden has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#eeeeee]",
        className
      )}
      {...props}
    />
  )
})
InputGroup.displayName = "InputGroup"

export interface InputGroupAddonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "inline-start" | "inline-end" | "block-end"
}

const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ className, align = "inline-start", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center text-sm text-muted-foreground",
          align === "inline-start" && "px-3 bg-muted border-r border-input",
          align === "inline-end" && "",
          align === "block-end" && "w-full px-2 py-1.5",
          className
        )}
        {...props}
      />
    )
  }
)
InputGroupAddon.displayName = "InputGroupAddon"

export interface InputGroupButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "primary"
  size?: "default" | "sm" | "icon-sm"
}

const InputGroupButton = React.forwardRef<
  HTMLButtonElement,
  InputGroupButtonProps
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-1 text-sm text-foreground hover:bg-accent transition-colors rounded-[10px]",
        variant === "default" && "bg-muted",
        variant === "ghost" && "bg-transparent",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        size === "default" && "px-2",
        size === "sm" && "px-2 h-7 text-xs",
        size === "icon-sm" && "h-7 w-7 p-0",
        className
      )}
      {...props}
    />
  )
})
InputGroupButton.displayName = "InputGroupButton"

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex-1 h-full px-3 text-sm bg-transparent focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
InputGroupInput.displayName = "InputGroupInput"

const InputGroupTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex-1 min-h-[128px] px-3 py-2 text-sm bg-transparent focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
})
InputGroupTextarea.displayName = "InputGroupTextarea"

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea }
