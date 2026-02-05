import * as React from "react"
import { cn } from "@/lib/utils"

const FlowNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "group relative min-w-[328px] min-h-[80px] flex items-center gap-3 px-3 border border-border bg-background rounded-[10px] overflow-hidden",
      className
    )}
    {...props}
  />
))
FlowNode.displayName = "FlowNode"

const FlowNodeIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-center text-muted-foreground", className)}
    {...props}
  />
))
FlowNodeIcon.displayName = "FlowNodeIcon"

const FlowNodeContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
FlowNodeContent.displayName = "FlowNodeContent"

const FlowNodeType = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
))
FlowNodeType.displayName = "FlowNodeType"

const FlowNodeName = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
))
FlowNodeName.displayName = "FlowNodeName"

const FlowNodeOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-0 flex flex-col gap-2 p-3 bg-background/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity",
      className
    )}
    {...props}
  />
))
FlowNodeOverlay.displayName = "FlowNodeOverlay"

const FlowNodeActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
))
FlowNodeActions.displayName = "FlowNodeActions"

const FlowNodeFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full flex items-center justify-between text-xs text-muted-foreground", className)}
    {...props}
  />
))
FlowNodeFooter.displayName = "FlowNodeFooter"

export {
  FlowNode,
  FlowNodeIcon,
  FlowNodeContent,
  FlowNodeType,
  FlowNodeName,
  FlowNodeOverlay,
  FlowNodeActions,
  FlowNodeFooter,
}
