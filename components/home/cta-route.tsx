import { cn } from "@/lib/utils"

const ROUTE = "M70 330 C 70 250, 170 260, 190 200 S 150 110, 250 90 S 340 70, 340 40"

/** Animated route: GoPark car park → shuttle along the road → terminal. */
export function CtaRoute({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 380" aria-hidden className={cn("cta-route h-auto w-full overflow-visible", className)}>
      <defs>
        <radialGradient id="cta-pin-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2563eb" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>
        <pattern id="cta-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.06" />
        </pattern>
      </defs>

      <rect width="400" height="380" fill="url(#cta-dots)" />

      {/* road: wide base, lane dashes, progress glow */}
      <path d={ROUTE} fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="26" strokeLinecap="round" />
      <path d={ROUTE} fill="none" stroke="#171717" strokeWidth="20" strokeLinecap="round" />
      <path className="cta-dash" d={ROUTE} fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="8 10" strokeLinecap="round" />
      <path className="cta-trail" d={ROUTE} fill="none" stroke="#93b4ff" strokeWidth="4" strokeLinecap="round" pathLength={1} />

      {/* start: GoPark */}
      <circle className="cta-pulse" cx="70" cy="330" r="34" fill="url(#cta-pin-glow)" />
      <g transform="translate(46 306)">
        <rect width="48" height="48" rx="12" fill="#2563eb" />
        <text x="24" y="34" textAnchor="middle" fontSize="28" fontWeight="800" fill="#ffffff" fontFamily="inherit">P</text>
      </g>
      <text x="104" y="345" fontSize="13" fontWeight="600" fill="#a3a3a3" fontFamily="inherit">GoPark</text>

      {/* shuttle riding the road, drawn under the terminal tile so it slips beneath it */}
      <g className="cta-bus" style={{ offsetPath: `path("${ROUTE}")` }}>
        <g className="cta-bus-body">
          <rect x="-14" y="-9" width="28" height="18" rx="5" fill="#ffffff" />
          <rect x="-10" y="-5" width="13" height="6" rx="1.5" fill="#2563eb" />
          <rect x="6" y="-5" width="5" height="6" rx="1.5" fill="#2563eb" />
          <circle cx="-7" cy="9" r="3" fill="#1e3a8a" />
          <circle cx="7" cy="9" r="3" fill="#1e3a8a" />
        </g>
      </g>

      {/* end: terminal */}
      <circle className="cta-pulse" cx="340" cy="40" r="34" fill="url(#cta-pin-glow)" style={{ animationDelay: "1.2s" }} />
      <g transform="translate(316 16)">
        <rect width="48" height="48" rx="12" fill="#ffffff" />
        {/* plane */}
        <path
          d="M24 8c1.5 0 2.5 1.5 2.5 3v7l11 7v3l-11-3.5v7l3.5 2.5v2.5l-6-1.5-6 1.5v-2.5l3.5-2.5v-7l-11 3.5v-3l11-7v-7c0-1.5 1-3 2.5-3z"
          fill="#2563eb"
        />
      </g>
      <text x="340" y="6" textAnchor="middle" fontSize="13" fontWeight="600" fill="#a3a3a3" fontFamily="inherit">FCO Terminal</text>

      {/* time chip at the bend */}
      <g className="cta-chip" transform="translate(208 186)">
        <rect width="92" height="34" rx="17" fill="#ffffff" />
        <circle cx="18" cy="17" r="5" fill="#2563eb" className="cta-blink" />
        <text x="30" y="22" fontSize="14" fontWeight="700" fill="#2563eb" fontFamily="inherit">6 min</text>
      </g>

      <style>{`
        .cta-route .cta-bus { offset-distance: 0%; offset-rotate: auto; }
        .cta-route .cta-trail { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .cta-route .cta-pulse { transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: no-preference) {
          .cta-route .cta-bus { animation: cta-drive 6s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
          .cta-route .cta-bus-body { animation: cta-bus-fade 6s linear infinite; }
          .cta-route .cta-trail { animation: cta-trail 6s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
          .cta-route .cta-dash { animation: cta-flow 1.2s linear infinite; }
          .cta-route .cta-pulse { animation: cta-pulse 2.4s ease-in-out infinite; }
          .cta-route .cta-blink { animation: cta-blink 1.2s ease-in-out infinite; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-route .cta-bus { offset-distance: 55%; }
          .cta-route .cta-trail { stroke-dashoffset: 0.45; }
        }
        /* drive and trail share one smooth segment, so the line stays right under the shuttle */
        @keyframes cta-drive { 0%, 8% { offset-distance: 0%; } 80%, 100% { offset-distance: 100%; } }
        @keyframes cta-trail { 0%, 8% { stroke-dashoffset: 1; opacity: 1; } 80% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: 0; opacity: 0; } }
        /* separate fade as it slips under the terminal tile */
        @keyframes cta-bus-fade { 0%, 66% { opacity: 1; } 78%, 100% { opacity: 0; } }
        @keyframes cta-flow { to { stroke-dashoffset: -18; } }
        @keyframes cta-pulse { 0%, 100% { transform: scale(0.85); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 1; } }
        @keyframes cta-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </svg>
  )
}
