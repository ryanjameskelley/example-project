import * as React from "react"
import { cn } from "@/lib/utils"

export interface FieldProps {
  label: string
  id?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ label, id, error, required, children, className }, ref) => {
    const fieldId = id || `field-${(label || '').toLowerCase().replace(/\s+/g, "-")}`

    return (
      <div ref={ref} className={cn("flex flex-col gap-1.5", className)}>
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              id: fieldId,
              "aria-invalid": error ? "true" : undefined,
              "aria-describedby": error ? `${fieldId}-error` : undefined,
            })
          }
          return child
        })}
        {error && (
          <p id={`${fieldId}-error`} className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Field.displayName = "Field"

export { Field }
