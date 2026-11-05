import { cn } from "@/lib/utils"

type GeometricSurfaceProps = {
  className?: string
  tone?: "light" | "dark" | "brand"
}

/**
 * Decorative low-poly facets. Purely presentational: aria-hidden,
 * pointer-events none, scales with its box via viewBox + slice.
 */
export function GeometricSurface({ className, tone = "light" }: GeometricSurfaceProps) {
  const fills = {
    light: ["#f6f8fc", "#f1f4fa", "#eceff7", "#f3f6fb", "#eef2f9", "#e8edf6"],
    dark: ["#0f1422", "#121829", "#161d30", "#0d1220", "#19213a", "#1d2745"],
    brand: ["#2563eb", "#2a69f0", "#2f6ff5", "#225de2", "#3474f8", "#1f57d8"],
  }[tone]

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <polygon points="0,0 520,0 300,380" fill={fills[0]} />
      <polygon points="520,0 980,0 760,300" fill={fills[1]} />
      <polygon points="980,0 1440,0 1440,260 1180,360" fill={fills[2]} />
      <polygon points="0,0 300,380 0,560" fill={fills[3]} />
      <polygon points="300,380 760,300 620,800 180,800" fill={fills[4]} />
      <polygon points="760,300 1180,360 1040,800 620,800" fill={fills[3]} />
      <polygon points="1180,360 1440,260 1440,800 1040,800" fill={fills[5]} />
      <polygon points="0,560 300,380 180,800 0,800" fill={fills[1]} />
      <polygon points="520,0 760,300 300,380" fill={fills[2]} />
      <polygon points="980,0 1180,360 760,300" fill={fills[0]} />
    </svg>
  )
}
