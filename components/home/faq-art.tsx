import { cn } from "@/lib/utils"

const TILES = [
  { ch: "F", x: 62, y: 120, r: -10, delay: 0 },
  { ch: "A", x: 158, y: 150, r: 4, delay: 0.25 },
  { ch: "Q", x: 254, y: 116, r: 9, delay: 0.5 },
]

/** Vertical animated FAQ artwork: letter tiles drop in and float above the heading. */
export function FaqArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 600" aria-hidden className={cn("faq-art h-auto w-full", className)}>
      <defs>
        <linearGradient id="faq-bg" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#0b0f19" />
          <stop offset="0.55" stopColor="#0b1a4a" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
        <radialGradient id="faq-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2563eb" stopOpacity="0.7" />
          <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="faq-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dbe6ff" />
        </linearGradient>
        <pattern id="faq-grid" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <path d="M0 0H28" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
        <clipPath id="faq-clip">
          <rect width="400" height="600" rx="24" />
        </clipPath>
      </defs>

      <g clipPath="url(#faq-clip)">
        <rect width="400" height="600" fill="#0a0a0a" />
        <rect width="400" height="600" fill="url(#faq-grid)" />

        {/* tiles */}
        {TILES.map((t) => (
          <g key={t.ch} transform={`translate(${t.x} ${t.y}) rotate(${t.r} 42 42)`}>
            <g className="faq-tile" style={{ animationDelay: `${t.delay}s, ${t.delay + 0.9}s` }}>
              <rect x="0" y="8" width="84" height="84" rx="12" fill="#2563eb" opacity="0.55" />
              <rect width="84" height="84" rx="12" fill="url(#faq-tile)" />
              <rect x="1" y="1" width="82" height="82" rx="11" fill="none" stroke="#ffffff" strokeOpacity="0.9" />
              <text x="42" y="60" textAnchor="middle" fontSize="50" fontWeight="800" fill="#2563eb" fontFamily="inherit">
                {t.ch}
              </text>
            </g>
          </g>
        ))}

        {/* sparkles */}
        {[
          [48, 70, 0],
          [350, 250, 1.2],
          [330, 60, 2.1],
          [80, 270, 0.7],
        ].map(([cx, cy, d]) => (
          <circle key={`${cx}-${cy}`} className="faq-spark" cx={cx} cy={cy} r="2.5" fill="#93b4ff" style={{ animationDelay: `${d}s` }} />
        ))}

        {/* heading */}
        <rect className="faq-line" x="40" y="320" width="60" height="4" rx="2" fill="#2563eb" />
        <g fontFamily="inherit" fontWeight="900" fontSize="46" letterSpacing="-1">
          <text className="faq-word" x="40" y="390" fill="#ffffff" style={{ animationDelay: "0.9s" }}>FREQUENTLY</text>
          <text className="faq-word" x="40" y="440" fill="#3b82f6" style={{ animationDelay: "1.05s" }}>ASKED</text>
          <text className="faq-word" x="40" y="490" fill="#ffffff" style={{ animationDelay: "1.2s" }}>QUESTIONS</text>
        </g>
        <text className="faq-word" x="40" y="535" fill="#a7b0c2" fontSize="18" fontFamily="inherit" style={{ animationDelay: "1.4s" }}>
          Everything you need to know.
        </text>
      </g>

      <style>{`
        .faq-art .faq-tile, .faq-art .faq-word, .faq-art .faq-line, .faq-art .faq-glow, .faq-art .faq-spark {
          transform-box: fill-box;
          transform-origin: center;
        }
        .faq-art .faq-line { transform-origin: left; }
        @media (prefers-reduced-motion: no-preference) {
          .faq-art .faq-tile { animation: faq-drop 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) both, faq-float 4s ease-in-out infinite; }
          .faq-art .faq-word { animation: faq-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .faq-art .faq-line { animation: faq-grow 0.8s 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .faq-art .faq-glow { animation: faq-pulse 5s ease-in-out infinite; }
          .faq-art .faq-spark { animation: faq-twinkle 3s ease-in-out infinite; }
        }
        @keyframes faq-drop { from { transform: translateY(-220px) rotate(-20deg); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes faq-float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-8px) rotate(2deg); } }
        @keyframes faq-rise { from { transform: translateY(24px); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes faq-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes faq-pulse { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
        @keyframes faq-twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>
    </svg>
  )
}
