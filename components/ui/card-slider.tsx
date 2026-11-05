"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CardSliderProps = {
  label: string
  /** Auto-advance interval in ms; a progress ring on the next arrow shows the countdown. */
  autoPlay?: number
  /** Extra content shown left of the arrows (e.g. the section heading). */
  header?: React.ReactNode
  /** Slides per view on lg screens (default 3). 4 means 3 on lg and 4 from xl, so cards stay readable at 1024px. */
  lgPerView?: 3 | 4
  /** Extra classes for the row holding the header and the arrows (e.g. to keep it at the normal page width inside a wider container). */
  headerClassName?: string
  className?: string
  children: React.ReactNode
}

/**
 * Horizontal scroll-snap slider. Each direct child is one slide; slide widths
 * come from the `[&>*]` rules below (3 per view on lg, 2 on sm, ~1 on mobile).
 * Arrows scroll by one slide and disable at either end. With `autoPlay`, a
 * countdown ring advances the slider back and forth (ping-pong); the ring sits
 * on the arrow of the current direction.
 */
export function CardSlider({ label, autoPlay, header, lgPerView = 3, headerClassName, className, children }: CardSliderProps) {
  const track = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  // Autoplay: a timeout per `cycle` advances the slider; the ring is a purely
  // visual countdown restarted with the same `cycle`. Runs continuously.
  const [cycle, setCycle] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [reduced, setReduced] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMq = () => setReduced(mq.matches)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read client-only media query after mount
    syncMq()
    mq.addEventListener("change", syncMq)
    return () => mq.removeEventListener("change", syncMq)
  }, [])

  const sync = useCallback(() => {
    const el = track.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener("resize", sync)
    return () => window.removeEventListener("resize", sync)
  }, [sync])

  /** Scroll one slide; returns the direction to use next (flipped if this move lands on an end). */
  function step(d: 1 | -1): 1 | -1 {
    const el = track.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return d
    const gap = parseFloat(getComputedStyle(el).columnGap || "0")
    const delta = d * (first.offsetWidth + gap)
    const max = el.scrollWidth - el.clientWidth
    const target = Math.min(max, Math.max(0, el.scrollLeft + delta))
    el.scrollBy({ left: delta, behavior: "smooth" })
    // Decide now, not when the smooth scroll finishes, so the ring swaps instantly.
    if (d === 1 && target >= max - 2) return -1
    if (d === -1 && target <= 2) return 1
    return d
  }

  // Everything fits (e.g. 4 cards on xl with lgPerView 4): no arrows, no autoplay.
  const fits = atStart && atEnd
  const auto = Boolean(autoPlay) && !reduced && !fits

  // Direction actually available right now: flip at the ends so the ring is
  // never parked on a disabled arrow.
  const heading: 1 | -1 = dir === 1 && atEnd ? -1 : dir === -1 && atStart ? 1 : dir

  /** Autoplay tick: move in the available direction (ping-pong at the ends). */
  function advance() {
    setDir(step(heading))
    setCycle((c) => c + 1)
  }

  // Latest advance() for the timer, so the timeout never calls a stale closure.
  const advanceRef = useRef(advance)
  useEffect(() => {
    advanceRef.current = advance
  })
  useEffect(() => {
    if (!auto || !autoPlay) return
    const t = window.setTimeout(() => advanceRef.current(), autoPlay)
    return () => window.clearTimeout(t)
  }, [auto, autoPlay, cycle])

  function manual(d: 1 | -1) {
    setDir(step(d)) // autoplay continues in the user's direction (flips at an end)
    setCycle((c) => c + 1) // restart the countdown after a manual move
  }

  /** Countdown ring around the active arrow (visual only; the timer drives autoplay). */
  const ring = (show: boolean) =>
    auto && (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className={cn("pointer-events-none absolute -inset-0.5 size-12 -rotate-90", show ? "visible" : "invisible")}
    >
      {/* track: full faint circle the progress travels along */}
      <circle cx="24" cy="24" r="22" fill="none" stroke="var(--border)" strokeWidth="2" />
      <circle
        key={cycle}
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={100}
        strokeDasharray="100"
        className="slider-ring"
        style={{ animationDuration: `${autoPlay}ms` }}
      />
    </svg>
  )

  const arrow =
    "grid size-11 place-items-center rounded-full border bg-card text-foreground transition-[background-color,color,opacity] hover:bg-primary hover:text-primary-foreground disabled:pointer-events-none disabled:opacity-35"

  return (
    <div
      className={cn("stack [--stack-gap:var(--space-l)]", className)}
    >
      <div className={cn("flex items-end justify-between gap-m", headerClassName)}>
        <div className="min-w-0">{header}</div>
        <div className={cn("flex shrink-0 gap-2xs", fits && "hidden")}>
          <div className="relative">
            <button
              type="button"
              aria-label="Previous"
              onClick={() => manual(-1)}
              disabled={atStart}
              className={cn(arrow, auto && heading === -1 && "border-transparent text-primary")}
            >
              <ArrowLeftIcon className="size-5" />
            </button>
            {ring(heading === -1)}
          </div>
          <div className="relative">
            <button
              type="button"
              aria-label="Next"
              onClick={() => manual(1)}
              disabled={atEnd}
              className={cn(arrow, auto && heading === 1 && "border-transparent text-primary")}
            >
              <ArrowRightIcon className="size-5" />
            </button>
            {ring(heading === 1)}
          </div>
        </div>
      </div>

      <ul
        ref={track}
        aria-label={label}
        onScroll={sync}
        className={cn(
          "-mx-gutter flex snap-x snap-mandatory gap-s overflow-x-auto scroll-px-gutter px-gutter pb-8 -mb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "[&>*]:shrink-0 [&>*]:snap-start [&>*]:basis-[85%] sm:[&>*]:basis-[calc((100%-var(--space-s))/2)]",
          lgPerView === 4
            ? "lg:[&>*]:basis-[calc((100%-2*var(--space-s))/3)] xl:[&>*]:basis-[calc((100%-3*var(--space-s))/4)]"
            : "lg:[&>*]:basis-[calc((100%-2*var(--space-s))/3)]",
          "lg:mx-0 lg:scroll-px-0 lg:px-0",
        )}
      >
        {children}
      </ul>
    </div>
  )
}
