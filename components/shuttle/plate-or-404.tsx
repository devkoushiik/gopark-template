"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { CallShuttle } from "@/components/shuttle/call-shuttle"

// A single path segment that looks like a licence plate: letters and digits, 4-10 chars (e.g. /AB123CD).
// Real pages (/about, /faq...) are matched first, so they never reach here.
const PLATE_RE = /^\/([a-z0-9]{4,10})\/?$/i

/**
 * /PLATE short link for the shuttle (e.g. printed on the parking ticket).
 * The site is a static export, so there's no server route per plate: unknown paths land on the
 * not-found page and this decides in the browser whether it's a plate or a real 404.
 */
export function PlateOr404() {
  const path = usePathname()
  const m = path.match(PLATE_RE)
  if (m) return <CallShuttle plate={m[1].toUpperCase()} />

  return (
    <div className="container-fluid stack items-center py-section text-center [--stack-gap:var(--space-s)]">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-h1 font-bold">Page not found.</h1>
      <p className="max-w-[40ch] text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="flex flex-wrap justify-center gap-xs">
        <Link href="/" className="inline-flex h-11 items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary-hover">
          Back to home
        </Link>
        <Link href="/call-shuttle" className="inline-flex h-11 items-center rounded-full border bg-card px-6 font-semibold hover:bg-secondary">
          Call the shuttle
        </Link>
      </div>
    </div>
  )
}
