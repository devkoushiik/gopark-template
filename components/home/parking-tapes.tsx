"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const DEFAULT_WORDS = ["Parking", "Shuttle", "Fiumicino", "24/7", "Parking", "Car wash", "Fiumicino", "Car valet"]

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-[0.9em] shrink-0", className)}>
      {[0, 45, 90, 135].map((r) => (
        <rect key={r} x="10" y="1" width="4" height="22" rx="2" transform={`rotate(${r} 12 12)`} fill="currentColor" />
      ))}
    </svg>
  )
}

function Tape({
  trackRef,
  words,
  className,
  starClasses,
}: {
  trackRef: React.RefObject<HTMLDivElement | null>
  words: string[]
  className: string
  starClasses: string[]
}) {
  // repeat the run so the band never shows an edge while it slides
  const items = [...words, ...words, ...words]
  return (
    <div className={cn("w-[140%] -ml-[20%] overflow-hidden py-3 shadow-lg", className)}>
      <div ref={trackRef} className="flex w-max items-center gap-6 whitespace-nowrap will-change-transform">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-6 text-[clamp(1.5rem,3.4vw,2.75rem)] font-black tracking-tight uppercase">
            <Star className={starClasses[i % starClasses.length]} />
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Two crossed "parking tape" bands that slide in opposite directions as the page scrolls. */
/** `className` sets the band's own background, so it can match the sections above and below. */
export function ParkingTapes({ words = DEFAULT_WORDS, className }: { words?: string[]; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null)
  const front = useRef<HTMLDivElement>(null)
  const back = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const el = wrap.current
      if (!el) return
      const r = el.getBoundingClientRect()
      // -1 … 1 while the block travels through the viewport
      const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight
      const shift = p * 600
      if (front.current) front.current.style.transform = `translate3d(${-1200 + shift}px,0,0)`
      if (back.current) back.current.style.transform = `translate3d(${-1200 - shift}px,0,0)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={wrap} aria-hidden className={cn("relative isolate overflow-x-clip py-l select-none", className)}>
      <div className="rotate-[4deg]">
        <Tape trackRef={back} words={words} className="bg-[#0a0a0a] text-white" starClasses={["text-primary", "text-[#93b4ff]", "text-white"]} />
      </div>
      <div className="-mt-[clamp(3rem,6vw,5rem)] -rotate-[3deg]">
        <Tape trackRef={front} words={words} className="bg-primary text-white" starClasses={["text-white", "text-[#0a0a0a]", "text-[#93b4ff]"]} />
      </div>
    </div>
  )
}
