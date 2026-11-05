"use client"

import { Select } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Calling codes offered in the phone field (Italy first: most customers)
const DIAL_CODES = [
  { code: "+39", country: "Italy" },
  { code: "+44", country: "United Kingdom" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+1", country: "United States / Canada" },
  { code: "+41", country: "Switzerland" },
  { code: "+31", country: "Netherlands" },
  { code: "+43", country: "Austria" },
  { code: "+32", country: "Belgium" },
]

/** Country calling code picker; submits as `name` like a native select. */
export function DialCodeSelect({ name, defaultValue = "+39", className }: { name: string; defaultValue?: string; className?: string }) {
  return (
    <Select.Root name={name} defaultValue={defaultValue}>
      <Select.Trigger
        aria-label="Country calling code"
        className={cn(
          "flex h-12 shrink-0 items-center justify-between gap-2xs rounded-lg border border-input bg-card pr-2.5 pl-3 text-sm tabular transition-colors outline-none",
          "hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-primary data-popup-open:bg-card",
          className,
        )}
      >
        <Select.Value />
        <Select.Icon className="text-muted-foreground transition-transform data-popup-open:rotate-180">
          <ChevronDownIcon aria-hidden className="size-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner alignItemWithTrigger={false} align="start" sideOffset={8} className="isolate z-50">
          <Select.Popup className="w-[min(18rem,calc(100vw-2rem))] origin-(--transform-origin) rounded-card bg-popover p-1.5 text-sm text-popover-foreground shadow-[0_24px_48px_-16px_rgb(11_15_25/0.35)] ring-1 ring-foreground/10 outline-hidden duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Select.List className="max-h-72 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              {DIAL_CODES.map(({ code, country }) => (
                <Select.Item
                  key={code}
                  value={code}
                  className="flex min-h-10 cursor-default items-center gap-xs rounded-lg px-2.5 py-1.5 outline-none select-none data-highlighted:bg-brand-soft data-highlighted:text-brand-soft-foreground data-selected:font-semibold"
                >
                  {/* fixed slot so names line up whether or not the check shows */}
                  <span className="size-5 shrink-0">
                    <Select.ItemIndicator className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon aria-hidden className="size-3" strokeWidth={3} />
                    </Select.ItemIndicator>
                  </span>
                  <span className="flex-1 truncate">{country}</span>
                  <Select.ItemText className="tabular text-muted-foreground">{code}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
