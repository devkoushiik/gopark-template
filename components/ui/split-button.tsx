"use client"

import { ArrowUpRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type SplitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const ease = "ease-[cubic-bezier(0.65,0,0.35,1)] duration-500 motion-reduce:transition-none"

/**
 * Nested split button. At rest a white arrow circle sits inside the blue pill.
 * On hover/focus the pill pulls in and the circle slides out to its own spot
 * with a clear gap, turning blue with a white arrow (↗ turns to →).
 */
export function SplitButton({ className, children, ...props }: SplitButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "group relative inline-flex h-cta w-full items-center rounded-full text-base font-semibold text-primary-foreground outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
        "transition-transform duration-200 active:scale-[0.98]",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {/* pill: full width at rest, pulls in to leave room + gap for the circle */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 right-0 rounded-full bg-primary transition-[right]",
          "group-hover:right-[calc(var(--cta-h)+1px)] group-focus-visible:right-[calc(var(--cta-h)+1px)]",
          ease,
        )}
      />

      {/* label: centred between the pill's left edge and the circle's left edge in both
          states (circle footprint is 0.88 x height nested, full height separated) */}
      <span
        className={cn(
          "relative flex-1 pr-[calc(var(--cta-h)*0.88)] text-center transition-[padding]",
          "group-hover:pr-[calc(var(--cta-h)+1px)] group-focus-visible:pr-[calc(var(--cta-h)+1px)]",
          ease,
        )}
      >
        {children}
      </span>

      {/* circle: nested white inside the pill, then out on its own in blue */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 right-0 grid aspect-square place-items-center rounded-full",
          "scale-[0.76] bg-white text-primary",
          "transition-[scale,background-color,color]",
          "group-hover:scale-100 group-hover:bg-primary group-hover:text-primary-foreground",
          "group-focus-visible:scale-100 group-focus-visible:bg-primary group-focus-visible:text-primary-foreground",
          ease,
        )}
      >
        <ArrowUpRightIcon
          className={cn("size-5 transition-transform group-hover:rotate-45 group-focus-visible:rotate-45", ease)}
        />
      </span>
    </button>
  )
}
