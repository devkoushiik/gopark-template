import { cn } from "@/lib/utils"

type ToggleRowProps = {
  id: string
  label: string
  hint: string
  price: React.ReactNode
  checked: boolean
  disabled?: boolean
  note?: React.ReactNode
  onChange: (checked: boolean) => void
}

/** Extra with a switch. Native checkbox + role="switch" for a11y. */
export function ToggleRow({ id, label, hint, price, checked, disabled, note, onChange }: ToggleRowProps) {
  return (
    <div className={cn("flex items-start justify-between gap-s py-s", disabled && "opacity-60")}>
      <div className="min-w-0">
        <label htmlFor={id} className="font-semibold">
          {label} <span className="ml-1 font-medium text-muted-foreground tabular">{price}</span>
        </label>
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">{hint}</p>
        {note}
      </div>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-describedby={`${id}-hint`}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "relative mt-1 h-7 w-12 shrink-0 cursor-pointer appearance-none rounded-full bg-accent transition-colors",
          "before:absolute before:top-1 before:left-1 before:size-5 before:rounded-full before:bg-card before:shadow-sm before:transition-transform",
          "checked:bg-primary checked:before:translate-x-5 disabled:cursor-not-allowed",
          "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        )}
      />
    </div>
  )
}
