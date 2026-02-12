import * as React from "react"
import { GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MultiFieldItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onDelete?: () => void
}

const MultiFieldItem = React.forwardRef<HTMLDivElement, MultiFieldItemProps>(
  ({ className, children, onDelete, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-[10px] border border-border p-2",
          className
        )}
        {...props}
      >
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing focus:outline-none"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        <div className="flex flex-1 gap-2">{children}</div>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="focus:outline-none"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
    )
  }
)

MultiFieldItem.displayName = "MultiFieldItem"

export { MultiFieldItem }
