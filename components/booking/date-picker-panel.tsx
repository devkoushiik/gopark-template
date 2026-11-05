"use client"

import { format } from "date-fns"
import { DayPicker } from "react-day-picker"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/** "YYYY-MM-DD" <-> local Date (no UTC shift). */
export const parseDate = (v: string) => {
  const [y, m, d] = v.split("-").map(Number)
  return new Date(y, m - 1, d)
}
const toValue = (d: Date) => format(d, "yyyy-MM-dd")

function Chevron({ orientation, className }: { orientation?: "up" | "down" | "left" | "right"; className?: string }) {
  const Icon = orientation === "left" ? ChevronLeftIcon : ChevronRightIcon
  return <Icon className={cn("size-4", className)} />
}

type DatePickerPanelProps = {
  value: string
  min: string
  trip: { from: string; to: string }
  /** Called with the picked "YYYY-MM-DD". */
  onPick: (value: string) => void
}

/** Calendar body of DateField. Kept in its own module so react-day-picker loads on first open, not with the page. */
export default function DatePickerPanel({ value, min, trip, onPick }: DatePickerPanelProps) {
  const selected = parseDate(value)
  const from = parseDate(trip.from)
  const to = parseDate(trip.to)
  const validTrip = to >= from

  return (
    <DayPicker
      mode="single"
      required
      weekStartsOn={1}
      showOutsideDays
      selected={selected}
      defaultMonth={selected}
      disabled={{ before: parseDate(min) }}
      onSelect={(d) => {
        if (!d) return
        onPick(toValue(d))
      }}
      modifiers={
        validTrip
          ? { trip: { from, to }, tripStart: from, tripEnd: to }
          : undefined
      }
      modifiersClassNames={{
        trip: "bg-brand-soft text-brand-soft-foreground",
        tripStart: "rounded-l-full",
        tripEnd: "rounded-r-full",
      }}
      components={{ Chevron }}
      classNames={{
        root: "relative",
        months: "relative",
        month: "flex flex-col gap-xs",
        month_caption: "flex h-9 items-center pl-1",
        caption_label: "text-base font-semibold",
        nav: "absolute top-0 right-0 flex gap-1",
        button_previous:
          "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30",
        button_next:
          "grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30",
        month_grid: "border-collapse",
        weekdays: "flex",
        weekday: "w-10 pb-1 text-center text-fine font-medium text-muted-foreground",
        week: "mt-0.5 flex",
        day: "size-10 p-0 text-center text-sm tabular",
        day_button:
          "grid size-10 place-items-center rounded-full transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50",
        selected: "[&>button]:bg-primary [&>button]:font-semibold [&>button]:text-primary-foreground [&>button]:hover:bg-primary-hover",
        today: "[&>button]:font-bold [&>button]:underline [&>button]:decoration-primary [&>button]:decoration-2 [&>button]:underline-offset-4",
        outside: "text-muted-foreground/45",
        disabled: "pointer-events-none text-muted-foreground/35 line-through decoration-1",
        hidden: "invisible",
      }}
      footer={
        validTrip && (
          <p className="mt-xs flex items-center justify-between gap-s border-t pt-xs text-sm">
            <span className="text-muted-foreground">Your stay</span>
            <span className="font-medium tabular">
              {format(from, "d MMM")} <span className="text-muted-foreground">to</span> {format(to, "d MMM")}
            </span>
          </p>
        )
      }
    />
  )
}
