import { cn } from "@/lib/utils"

/**
 * Round rubber-stamp mark: ring text + P. Decorative only (the same claim is
 * stated in text in the hero), so it is hidden from assistive tech.
 */
export function ValidationStamp({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={cn("text-primary mix-blend-multiply", className)}
    >
      <defs>
        <path id="stamp-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="currentColor" strokeWidth="1.25" />
      {/* textLength = ring circumference (2 * PI * 37), so the text wraps the full circle end to end */}
      <text fill="currentColor" fontSize="7.6" fontWeight="700">
        <textPath href="#stamp-ring" startOffset="0" textLength="232.5" lengthAdjust="spacing">
          OFFICIAL CAR PARK • ROME FIUMICINO •{" "}
        </textPath>
      </text>
      <text x="50" y="57" textAnchor="middle" fill="currentColor" fontSize="26" fontWeight="800">
        P
      </text>
      <text x="50" y="69" textAnchor="middle" fill="currentColor" fontSize="6.5" fontWeight="700" letterSpacing="1.5">
        FCO
      </text>
    </svg>
  )
}
