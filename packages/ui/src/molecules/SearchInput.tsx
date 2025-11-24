import * as React from "react"
import { Search } from "lucide-react"
import { Input, type InputProps } from "../atoms/Input"
import { cn } from "../lib/utils"

export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onSearch?.(e.target.value)
    }

    return (
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          className={cn("pl-8", className)}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

export { SearchInput }