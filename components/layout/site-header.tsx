"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

import { Logo } from "@/components/layout/logo"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { HEADER_NAV } from "@/lib/constants"
import { cn } from "@/lib/utils"

/** Route links are active by prefix; in-page anchors never claim "current". */
export function isActive(pathname: string, href: string) {
  if (href.includes("#")) return false
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}

type Box = { left: number; width: number } | null

/**
 * Gliding-highlight header. A soft blue pill follows the hovered/focused link
 * and rests on the current page; it fades out when nothing is targeted.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const sentinel = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [box, setBox] = useState<Box>(null)

  const activeIndex = HEADER_NAV.findIndex((item) => isActive(pathname, item.href))

  // One source of truth: pill and text colour both follow `target`.
  const [hovered, setHovered] = useState<number | null>(null)
  const target = hovered ?? (activeIndex >= 0 ? activeIndex : null)

  const measure = useCallback(() => {
    const li = target === null ? undefined : (listRef.current?.children[target + 1] as HTMLElement | undefined)
    setBox(li ? { left: li.offsetLeft, width: li.offsetWidth } : null)
  }, [target])

  useLayoutEffect(() => {
    measure()
  }, [measure])
  useEffect(() => {
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [measure])

  // Sentinel + IntersectionObserver instead of a scroll listener.
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute top-0 h-2 w-px" />
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-border bg-background/85 shadow-[0_8px_24px_-16px_rgb(11_15_25/0.25)] backdrop-blur-md supports-backdrop-filter:bg-background/75"
            : "border-transparent bg-background",
        )}
      >
        <div className="container-fluid flex h-header items-center gap-s">
          <Logo size="sm" className="shrink-0 rounded-md" />

          <nav aria-label="Primary" className="hidden flex-1 justify-center lg:flex">
            <ul ref={listRef} onMouseLeave={() => setHovered(null)} onBlur={() => setHovered(null)} className="relative flex items-center">
              {/* gliding highlight */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-0 left-0 h-full rounded-full bg-brand-soft transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  box ? "opacity-100" : "opacity-0",
                )}
                style={box ? { width: box.width, transform: `translateX(${box.left}px)` } : undefined}
              />
              {HEADER_NAV.map((item, i) => {
                const active = i === activeIndex
                const lit = i === target
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => setHovered(i)}
                      onFocus={() => setHovered(i)}
                      className={cn(
                        "inline-flex h-10 items-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
                        lit ? "text-brand-soft-foreground" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-xs lg:ml-0">
            {/* account is the pill button; booking lives first in the centre nav */}
            <Button
              className="hidden h-11 rounded-full px-6 sm:inline-flex"
              nativeButton={false}
              render={
<Link href="/login">Log in</Link>
              }
            />
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  )
}
