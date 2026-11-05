"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type RevealProps = {
  as?: "div" | "li" | "section"
  /** Stagger offset in ms, for one-by-one entrances in a row. */
  delay?: number
  className?: string
  /** Only flips `data-shown` (children animate themselves from it); skips the default rise. */
  plain?: boolean
  children: React.ReactNode
}

/**
 * Rises into place the first time it scrolls into view (see .reveal in
 * globals.css). Reduced motion: shown immediately, no movement.
 */
export function Reveal({ as: Tag = "div", delay = 0, className, plain = false, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic ref
      ref={ref as any}
      data-shown={shown || undefined}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(!plain && "reveal", className)}
    >
      {children}
    </Tag>
  )
}
