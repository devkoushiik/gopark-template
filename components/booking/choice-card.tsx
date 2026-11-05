import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type ChoiceCardProps = {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  hint?: string
  meta?: React.ReactNode
  className?: string
}

/** Radio styled as a selectable card. Native input keeps keyboard + SR semantics. */
export function ChoiceCard({ name, value, checked, onChange, label, hint, meta, className }: ChoiceCardProps) {
  return (
    <label
      className={cn(
        "group relative flex min-h-24 cursor-pointer flex-col justify-between gap-xs rounded-lg border bg-card p-s transition-colors",
        "hover:border-ring/40 has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground",
        "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <span className="flex items-start justify-between gap-xs">
        <span>
          <span className="block font-semibold">{label}</span>
          {hint && (
            <span className="mt-0.5 block text-sm text-muted-foreground group-has-checked:text-primary-foreground">
              {hint}
            </span>
          )}
        </span>
        <span
          aria-hidden
          className="grid size-5 shrink-0 place-items-center rounded-full border border-input group-has-checked:border-primary-foreground group-has-checked:bg-primary-foreground"
        >
          <CheckIcon className="size-3 text-primary opacity-0 group-has-checked:opacity-100" strokeWidth={3} />
        </span>
      </span>
      {meta && <span className="text-sm font-medium tabular">{meta}</span>}
    </label>
  )
}
