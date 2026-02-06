import * as React from 'react'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/components/molecules/Item'
import { cn } from '@/lib/utils'

export interface SearchListItem {
  id: string
  name: string
  description?: string
}

export interface SearchListProps {
  items: SearchListItem[]
  onSelect: (id: string) => void
  placeholder?: string
  className?: string
}

export const SearchList = React.forwardRef<HTMLDivElement, SearchListProps>(
  ({ items, onSelect, placeholder = 'Search...', className }, ref) => {
    const [search, setSearch] = React.useState('')

    const filteredItems = React.useMemo(() => {
      if (!search) return items
      const searchLower = search.toLowerCase()
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      )
    }, [items, search])

    return (
      <div ref={ref} className={cn('flex flex-col gap-4 bg-white rounded-[10px] p-4 shadow-sm', className)}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="h-8 rounded-[10px] border border-[#E5E5E5] bg-white px-3.5 text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#EEEEEE]"
        />

        <div className="flex flex-col gap-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No items found
            </div>
          ) : (
            filteredItems.map((item) => (
              <Item
                key={item.id}
                clickable
                onClick={() => onSelect(item.id)}
              >
                <ItemContent>
                  <ItemTitle>{item.name}</ItemTitle>
                  {item.description && (
                    <ItemDescription>{item.description}</ItemDescription>
                  )}
                </ItemContent>
              </Item>
            ))
          )}
        </div>
      </div>
    )
  }
)

SearchList.displayName = 'SearchList'
