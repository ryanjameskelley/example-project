import * as React from "react"
import { Input, type InputProps } from "../atoms/Input"
import { Label } from "../atoms/Label"
import { cn } from "../lib/utils"

export interface FormFieldProps extends InputProps {
  label?: string
  error?: string
  description?: string
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, error, description, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={inputId} className={error ? "text-destructive" : ""}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }