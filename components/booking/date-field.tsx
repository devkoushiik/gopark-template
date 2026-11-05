"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { format } from "date-fns"
import { CalendarDaysIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/** "YYYY-MM-DD" <-> local Date (no UTC shift). */
const parse = (v: string) => {
  const [y, m, d] = v.split("-").map(Number)
  return new Date(y, m - 1, d)
}

const loadPanel = () => import("@/components/booking/date-picker-panel")
// react-day-picker is only needed once a calendar opens; same size box meanwhile so nothing jumps
const DatePickerPanel = dynamic(loadPanel, {
  ssr: false,
  loading: () => <div aria-hidden className="h-[22rem] w-[17.5rem]" />,
})

type DateFieldProps = {
  id: string
  value: string
  min: string
  /** Whole trip, highlighted in the calendar so both pickers show the stay. */
  trip: { from: string; to: string }
  invalid?: boolean
  describedBy?: string
  className?: string
  onChange: (value: string) => void
}

export function DateField({ id, value, min, trip, invalid, describedBy, className, onChange }: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const selected = parse(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        onPointerEnter={loadPanel}
        onFocus={loadPanel}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(
          "flex h-control w-full min-w-0 items-center justify-between gap-2xs rounded-lg border border-transparent bg-secondary px-3 text-left text-base tabular transition-colors outline-none",
          "hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-primary data-popup-open:bg-card",
          invalid && "border-destructive",
          className,
        )}
      >
        <span className="truncate">{format(selected, "EEE d MMM")}</span>
        <CalendarDaysIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="w-auto gap-0 rounded-card p-s shadow-[0_24px_48px_-16px_rgb(11_15_25/0.35)]">
        <DatePickerPanel
          value={value}
          min={min}
          trip={trip}
          onPick={(v) => {
            onChange(v)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
