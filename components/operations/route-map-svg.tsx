/**
 * Schematic (not to scale) of car park → A91 → Terminals 1 & 3.
 * Functional diagram, replaces location photography (spec §2).
 */
export function RouteMapSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 560"
      role="img"
      aria-labelledby="route-title route-desc"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="route-title">Route from GoPark to Fiumicino terminals</title>
      <desc id="route-desc">
        Schematic: the car park connects via the A91 motorway to Terminals 1 and 3, about 6 minutes by free shuttle.
      </desc>

      {/* low-poly ground */}
      <rect width="480" height="560" fill="var(--secondary)" />
      <polygon points="0,0 260,0 120,220" fill="#efefef" />
      <polygon points="260,0 480,0 480,180 340,240" fill="#ebebeb" />
      <polygon points="0,320 160,420 0,560" fill="#ebebeb" />
      <polygon points="300,560 480,380 480,560" fill="#efefef" />

      {/* A91 motorway */}
      <path d="M-20 470 C 140 430, 220 330, 260 250 S 380 90, 500 60" fill="none" stroke="#d4d4d4" strokeWidth="26" strokeLinecap="round" />
      <path d="M-20 470 C 140 430, 220 330, 260 250 S 380 90, 500 60" fill="none" stroke="var(--card)" strokeWidth="2" strokeDasharray="10 10" />
      <g transform="translate(196 318)">
        <rect x="-22" y="-12" width="44" height="24" rx="5" fill="var(--foreground)" />
        <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--card)" fontFamily="var(--font-geist-mono), monospace">A91</text>
      </g>

      {/* Shuttle route */}
      <path
        d="M120 470 C 150 420, 210 380, 250 300 S 330 170, 370 130"
        fill="none"
        stroke="var(--foreground)"
        strokeWidth="4"
        strokeDasharray="2 10"
        strokeLinecap="round"
      />

      {/* Car park */}
      <g transform="translate(120 470)">
        <circle r="34" fill="var(--foreground)" />
        <text y="9" textAnchor="middle" fontSize="28" fontWeight="800" fill="var(--card)">P</text>
        <rect x="-62" y="44" width="124" height="28" rx="14" fill="var(--card)" stroke="var(--border)" />
        <text y="63" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--foreground)">GoPark</text>
      </g>

      {/* Terminals */}
      <g transform="translate(370 130)">
        <circle r="34" fill="var(--card)" stroke="var(--foreground)" strokeWidth="3" />
        <path d="M-14 4 L14 -4 L16 2 L2 6 L-2 18 L-7 18 L-5 8 L-14 10 Z" fill="var(--foreground)" transform="rotate(-20)" />
        <rect x="-74" y="-82" width="148" height="28" rx="14" fill="var(--card)" stroke="var(--border)" />
        <text y="-63" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--foreground)">Terminals 1 & 3</text>
      </g>

      {/* Time badge */}
      <g transform="translate(300 300)">
        <rect x="-58" y="-26" width="116" height="52" rx="12" fill="var(--foreground)" />
        <text y="-2" textAnchor="middle" fontSize="20" fontWeight="800" fill="var(--card)">≈ 6 min</text>
        <text y="16" textAnchor="middle" fontSize="11" fill="#a3a3a3">free shuttle · 24/7</text>
      </g>

      <text x="16" y="544" fontSize="10" fill="var(--muted-foreground)">Schematic, not to scale</text>
    </svg>
  )
}
