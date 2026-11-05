"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type Stat = { head: string; value: string; unit?: string; label: string }

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const TICK_MS = 55

/**
 * One split-flap tile. When `go` turns true it rattles through random
 * characters (each change flips down) and lands on `char`.
 */
function FlapTile({ char, go, delay }: { char: string; go: boolean; delay: number }) {
  const [shown, setShown] = useState(char)

  useEffect(() => {
    if (!go || char === " ") return
    let ticks = 6 + Math.floor(Math.random() * 6)
    let interval: number | undefined
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        ticks -= 1
        if (ticks <= 0) {
          setShown(char)
          window.clearInterval(interval)
          return
        }
        setShown(CHARSET[Math.floor(Math.random() * CHARSET.length)])
      }, TICK_MS)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [go, char, delay])

  return (
    <span
      className={cn(
        "relative inline-grid h-[1.25em] w-[0.86em] place-items-center overflow-hidden rounded-[0.14em] font-mono font-bold text-ink-foreground",
        // two flap halves + hinge seam
        "bg-[linear-gradient(180deg,#1c2438_0%,#1a2133_49.5%,#0f1422_50.5%,#141b2c_100%)]",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_6px_14px_-6px_rgb(11_15_25/0.5)]",
        "after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/70",
      )}
    >
      <span key={shown} className="motion-safe:animate-flap">
        {shown}
      </span>
    </span>
  )
}

/**
 * Key facts as an airport departures board. Tiles rattle into place,
 * staggered left to right, the first time the board scrolls into view.
 * Reduced motion: final values, no rattle.
 */
export function FlapBoard({ stats, startOn, className }: { stats: Stat[]; startOn?: string; className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const [go, setGo] = useState(false)

  // Start when the board is actually seen. Under a shutter (startOn = id of the
  // hero's bottom edge) the board is "in view" but covered, so watch the edge instead.
  useEffect(() => {
    const el = startOn ? document.getElementById(startOn) : ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGo(true)
          io.disconnect()
        }
      },
      startOn ? { rootMargin: "0px 0px -20% 0px" } : { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [startOn])

  // Running tile index across the whole board, for the left-to-right stagger.
  const offsets = stats.map((_, i) => stats.slice(0, i).reduce((n, x) => n + x.value.length, 0))

  return (
    <section ref={ref} aria-label="Key facts" className={cn("relative isolate overflow-hidden border-b border-border bg-secondary text-foreground", className)}>
      {/* faint board grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(11_15_25/0.06)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <dl className="container-fluid grid grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.head}
            className={cn(
              "flex flex-col gap-s py-m",
              i % 2 === 1 ? "border-l border-border pl-s sm:pl-m" : "pr-s",
              i >= 2 && "border-t border-border lg:border-t-0",
              i > 0 && "lg:border-l lg:border-border lg:pl-m",
            )}
          >
            <dt className="order-1 text-sm font-medium text-muted-foreground">{s.head}</dt>
            <dd className="order-2 flex items-end gap-2xs">
              <span className="sr-only">
                {s.value}
                {s.unit ? ` ${s.unit}` : ""}
              </span>
              <span aria-hidden className="flex gap-[0.08em] text-h1 leading-none">
                {[...s.value].map((c, j) => (
                  <FlapTile key={j} char={c} go={go} delay={(offsets[i] + j) * 70} />
                ))}
              </span>
              {s.unit && (
                <span aria-hidden className="pb-1 text-h3 font-semibold text-primary">
                  {s.unit}
                </span>
              )}
            </dd>
            <dd className="order-3 text-sm text-muted-foreground">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
