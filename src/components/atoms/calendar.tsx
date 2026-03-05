import * as React from "react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        // relative so the absolute nav anchors to the months container
        months: "relative flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        month_caption: "flex justify-center pt-1 items-center",
        caption_label: "text-sm font-medium",
        // nav is rendered once before months; overlay it across the full caption row
        nav: "pointer-events-none absolute inset-x-0 top-0 flex justify-between items-center px-1 pt-1",
        button_previous: cn(
          "pointer-events-auto h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
        ),
        button_next: cn(
          "pointer-events-auto h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          "inline-flex items-center justify-center rounded-md border border-input hover:bg-accent"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-muted-foreground w-9 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "relative h-9 w-9 p-0 text-center text-sm",
        day_button: cn(
          "h-9 w-9 p-0 font-normal rounded-md w-full",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        ),
        selected:
          "[&:not(.range_middle)>button]:bg-[#eeeeee] [&:not(.range_middle)>button]:text-gray-900",
        today: "[&>button]:font-semibold",
        outside: "[&>button]:text-muted-foreground [&>button]:opacity-40",
        disabled: "[&>button]:text-muted-foreground [&>button]:opacity-30 [&>button]:pointer-events-none",
        range_middle:
          "bg-[#f5f5f5] [&>button]:bg-transparent [&>button]:text-gray-900 [&>button]:rounded-none [&>button]:hover:bg-[#eeeeee]",
        range_start: "rounded-l-md [&>button]:rounded-l-md [&>button]:rounded-r-none",
        range_end: "rounded-r-md [&>button]:rounded-r-md [&>button]:rounded-l-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
