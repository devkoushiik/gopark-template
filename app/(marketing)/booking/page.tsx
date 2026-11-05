import type { Metadata } from "next"
import { Suspense } from "react"
import { BadgeCheckIcon, BusIcon, ClockIcon, KeyRoundIcon, TimerIcon } from "lucide-react"

import { BookingConfigurator } from "@/components/booking/booking-configurator"
import { DotPattern } from "@/components/layout/dot-pattern"

export const metadata: Metadata = {
  title: "Book parking — GoPark",
  description: "Book your parking at Rome Fiumicino in advance. Free shuttle to Terminals 1 & 3.",
}

const FACTS = [
  { Icon: BusIcon, label: "Free shuttle" },
  { Icon: TimerIcon, label: "6 min to T1 & T3" },
  { Icon: ClockIcon, label: "Open 24/7" },
  { Icon: KeyRoundIcon, label: "Keep your keys, free" },
]

export default function BookingPage() {
  return (
    <>
      {/* Same look as the contact hero (edge arcs, frosted pill, hero type); the trip form sits below it, not over it */}
      <section aria-labelledby="booking-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        <div aria-hidden className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />
        <div className="container-fluid stack py-xl [--stack-gap:var(--space-s)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <p className="inline-flex h-8 w-fit items-center gap-1.5 rounded-full bg-white/10 pr-3 pl-2.5 text-sm leading-none font-medium ring-1 ring-white/15 backdrop-blur-md">
            <BadgeCheckIcon aria-hidden className="size-4 shrink-0" />
            <span className="[text-box:trim-both_cap_alphabetic]">Official parking at Fiumicino</span>
          </p>
          <h1 id="booking-title" className="max-w-[14ch] text-hero font-bold">
            Book your parking.
          </h1>
          <p className="max-w-[48ch] text-lg text-white/80">
            Secure your space in advance, 6 minutes from Terminals 1 &amp; 3.
          </p>
          {/* quick reassurance, all facts stated elsewhere on the site */}
          <ul className="mt-2xs flex flex-wrap gap-2xs">
            {FACTS.map(({ Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85 ring-1 ring-white/15 backdrop-blur-md"
              >
                <Icon aria-hidden className="size-4 text-[#93b4ff]" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reads the URL + current time → request-time render, skeleton holds layout */}
      <Suspense
        fallback={
          <div className="container-fluid mt-l pb-section">
            <div aria-hidden className="h-40 animate-pulse rounded-card border bg-card shadow-lg" />
          </div>
        }
      >
        <BookingConfigurator />
      </Suspense>
    </>
  )
}
