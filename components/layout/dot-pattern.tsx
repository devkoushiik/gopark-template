import { cn } from "@/lib/utils"

/**
 * Soft dot pattern for the dark page headers (the ones with the rotating edge arcs): faint dots that
 * fade out toward the edges, so they never compete with the copy. Needs an `isolate` parent.
 */
export function DotPattern({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_85%_at_50%_50%,black_25%,transparent_85%)]",
        className,
      )}
      style={{
        backgroundImage: "radial-gradient(rgb(255 255 255 / 0.14) 1.2px, transparent 1.6px)",
        backgroundSize: "24px 24px",
      }}
    />
  )
}
