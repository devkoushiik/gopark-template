"use client"

import { useEffect, useRef, useState } from "react"
import { ClockIcon, MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TIME_OPTIONS } from "@/lib/datetime"
import { cn } from "@/lib/utils"

// Parts of the day; travellers think "early morning flight", not "06:30".
const GROUPS = [
  { label: "Night", Icon: MoonIcon, from: 0, to: 6 },
  { label: "Morning", Icon: SunriseIcon, from: 6, to: 12 },
  { label: "Afternoon", Icon: SunIcon, from: 12, to: 18 },
  { label: "Evening", Icon: SunsetIcon, from: 18, to: 24 },
]

const hourOf = (v: string) => Number(v.slice(0, 2))

/** Chip text: 12h clock, with named Noon / Midnight. */
function chipLabel(v: string) {
  if (v === "00:00") return "Midnight"
  if (v === "12:00") return "Noon"
  const h = hourOf(v) % 12 || 12
  return `${h}:${v.slice(3)}`
}

type TimeFieldProps = {
  id: string
  value: string
  invalid?: boolean
  className?: string
  onChange: (value: string) => void
}

export function TimeField({ id, value, invalid, className, onChange }: TimeFieldProps) {
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const current = TIME_OPTIONS.find((t) => t.value === value)

  // Open already scrolled to the chosen time. Scroll the list only:
  // scrollIntoView would also scroll the page and make it jump.
  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => {
      const list = listRef.current
      const chip = list?.querySelector<HTMLElement>('[aria-checked="true"]')
      if (!list || !chip) return
      list.scrollTop = chip.offsetTop - list.clientHeight / 2 + chip.offsetHeight / 2
    })
    return () => cancelAnimationFrame(raf)
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-invalid={invalid || undefined}
        className={cn(
          "flex h-control w-full min-w-0 items-center justify-between gap-2xs rounded-lg border border-transparent bg-secondary px-3 text-left text-base tabular transition-colors outline-none",
          "hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-primary data-popup-open:bg-card",
          invalid && "border-destructive",
          className,
        )}
      >
        <span className="truncate">{current?.label.replace(/ \((Noon|Midnight)\)/, "") ?? value}</span>
        <ClockIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(18rem,calc(100vw-2rem))] gap-0 rounded-card p-0 shadow-[0_24px_48px_-16px_rgb(11_15_25/0.35)]"
      >
        <div
          ref={listRef}
          role="radiogroup"
          aria-label="Choose a time"
          className="relative max-h-80 overflow-y-auto overscroll-contain p-s [scrollbar-width:thin]"
        >
          {GROUPS.map(({ label, Icon, from, to }) => (
            <section key={label} className="not-first:mt-s">
              <h3 className="sticky -top-s z-10 -mx-s mb-2xs flex items-center gap-2xs bg-popover px-s py-1.5 text-sm font-semibold">
                <Icon aria-hidden className="size-4 text-primary" />
                {label}
                <span className="font-normal text-muted-foreground">{from < 12 ? "AM" : "PM"}</span>
              </h3>
              <div className="grid grid-cols-4 gap-1">
                {TIME_OPTIONS.filter((t) => hourOf(t.value) >= from && hourOf(t.value) < to).map((t) => {
                  const active = t.value === value
                  const named = t.value === "00:00" || t.value === "12:00"
                  return (
                    <button
                      key={t.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={t.label}
                      onClick={() => {
                        onChange(t.value)
                        setOpen(false)
                      }}
                      className={cn(
                        "h-9 rounded-md text-sm tabular transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        named && "col-span-2 font-medium",
                        active
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "bg-secondary hover:bg-brand-soft hover:text-brand-soft-foreground",
                      )}
                    >
                      {chipLabel(t.value)}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
