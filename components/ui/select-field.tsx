"use client"

import { Select } from "@base-ui/react/select"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Dropdown styled like the site's inputs (replaces the browser's own select list, which can't be styled).
 * Pass `value` + `onValueChange` to control it, or `defaultValue` to leave it uncontrolled; it submits as `name`
 * like a native select, and `required` is checked with the rest of the form.
 */
export function SelectField({
  id,
  name,
  options,
  placeholder = "Select",
  value,
  defaultValue,
  onValueChange,
  required,
  className,
}: {
  id?: string
  name?: string
  options: readonly string[]
  placeholder?: string
  /** Controlled value; "" means nothing chosen. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  required?: boolean
  className?: string
}) {
  const controlled = value !== undefined
  return (
    <Select.Root
      id={id}
      name={name}
      required={required}
      {...(controlled ? { value: value || null } : { defaultValue: defaultValue || null })}
      onValueChange={(v) => onValueChange?.((v as string | null) ?? "")}
    >
      <Select.Trigger
        className={cn(
          "flex h-12 w-full items-center justify-between gap-xs rounded-lg border border-input bg-card pr-3 pl-3 text-left text-base transition-colors outline-none",
          "hover:bg-accent/60 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:border-primary",
          className,
        )}
      >
        <Select.Value placeholder={<span className="text-muted-foreground">{placeholder}</span>} className="truncate" />
        <Select.Icon className="shrink-0 text-muted-foreground transition-transform data-popup-open:rotate-180">
          <ChevronDownIcon aria-hidden className="size-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner alignItemWithTrigger={false} align="start" sideOffset={6} className="isolate z-50">
          <Select.Popup className="w-(--anchor-width) min-w-48 origin-(--transform-origin) rounded-card bg-popover p-1.5 text-sm text-popover-foreground shadow-[0_24px_48px_-16px_rgb(11_15_25/0.35)] ring-1 ring-foreground/10 outline-hidden duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <Select.List className="max-h-72 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              {options.map((o) => (
                <Select.Item
                  key={o}
                  value={o}
                  className="flex min-h-10 cursor-default items-center gap-xs rounded-lg px-2.5 py-1.5 outline-none select-none data-highlighted:bg-brand-soft data-highlighted:text-brand-soft-foreground data-selected:font-semibold"
                >
                  {/* fixed slot so labels line up whether or not the check shows */}
                  <span className="size-5 shrink-0">
                    <Select.ItemIndicator className="grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <CheckIcon aria-hidden className="size-3" strokeWidth={3} />
                    </Select.ItemIndicator>
                  </span>
                  <Select.ItemText className="flex-1 truncate">{o}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
