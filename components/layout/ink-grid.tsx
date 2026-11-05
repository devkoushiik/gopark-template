import { cn } from "@/lib/utils"

/**
 * Backdrop for dark (ink) panels: faint 32px grid with a blue glow from the
 * top-left, plus an optional softer one bottom-right. Shared by FAQ and About.
 */
export function InkGrid({ corner = false, className }: { corner?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage: [
          "radial-gradient(85% 140% at 0% 0%, rgb(37 99 235 / 0.28), transparent 75%)",
          corner && "radial-gradient(45% 70% at 100% 100%, rgb(37 99 235 / 0.16), transparent 75%)",
          "linear-gradient(rgb(255 255 255 / 0.045) 1px, transparent 1px)",
          "linear-gradient(90deg, rgb(255 255 255 / 0.045) 1px, transparent 1px)",
        ]
          .filter(Boolean)
          .join(", "),
        backgroundSize: [corner ? "100% 100%, 100% 100%" : "100% 100%", "32px 32px", "32px 32px"].join(", "),
      }}
    />
  )
}
