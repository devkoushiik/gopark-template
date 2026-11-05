import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarCheckIcon,
  MessageCircleIcon,
  PhoneIcon,
  SquareParkingIcon,
} from "lucide-react"

import { HeroVideo } from "@/components/home/hero-video"
import { Reveal } from "@/components/home/reveal"
import { ServicesFan } from "@/components/services/services-fan"
import { InkGrid } from "@/components/layout/ink-grid"
import { NotchTile } from "@/components/layout/notch-tile"
import { CONTACT } from "@/lib/constants"
import { DotPattern } from "@/components/layout/dot-pattern"

export const metadata: Metadata = {
  title: "Services | GoPark",
  description:
    "Free 24/7 shuttle, car valet, covered parking, car wash and more at Rome Fiumicino. Choose your extras when you book.",
}


export default function ServicesPage() {
  const phone = CONTACT.phones[0]
  const actions = [
    { href: "/booking", Icon: CalendarCheckIcon, title: "Book parking", body: "Pick your extras as you book.", primary: true },
    { href: "/contact", Icon: MessageCircleIcon, title: "Contact us", body: "Questions about an extra?" },
    { href: `tel:+39${phone.replace(/\s/g, "")}`, Icon: PhoneIcon, title: phone, body: "Call us, open 24/7." },
  ]

  return (
    <>
      {/* Hero: same treatment as the about and contact heroes (edge arcs, pill, hero type) */}
      <section aria-labelledby="services-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        <div aria-hidden className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />

        <div className="container-fluid grid items-center gap-xl py-xl lg:min-h-[min(44rem,calc(100svh-var(--header-h)))] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="stack [--stack-gap:var(--space-m)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <div className="stack [--stack-gap:var(--space-s)]">
              <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md">
                <SquareParkingIcon aria-hidden className="size-4" />
                Services
              </p>
              <h1 id="services-title" className="max-w-[14ch] text-hero font-bold">
                Everything you can add to your booking.
              </h1>
              <p className="max-w-[48ch] text-lg text-white/80">
                From the free 24/7 shuttle to valet, covered parking and a car wash. Choose your extras when
                booking and watch your total update in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-xs">
              <Link
                href="/booking"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition-[background-color,scale] hover:bg-white/90 active:scale-[0.97]"
              >
                Book parking <ArrowRightIcon aria-hidden className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-md transition-[background-color,scale] hover:bg-white/20 active:scale-[0.97]"
              >
                <MessageCircleIcon aria-hidden className="size-4" /> Contact us
              </Link>
            </div>
          </div>

          {/* white feature card: brand row, light headline, the parking footage in a rounded inset frame */}
          <div className="mx-auto w-full max-w-[30rem] rounded-[1.75rem] bg-white p-s text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:delay-150 motion-safe:duration-700 motion-safe:fill-mode-both">
            <div className="flex items-center justify-between border-b px-xs pt-2xs pb-s">
              <Image src="/brand/fav_icon.png" alt="GoPark" width={80} height={80} className="size-8 rounded-md" />
              <span className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">Fiumicino</span>
            </div>
            <p className="px-xs pt-m pb-m text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-[1.1] font-normal tracking-tight">
              Park once.
              <br />
              Add what you need.
            </p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
              <HeroVideo src="/videos/parking.mp4" className="absolute inset-0 size-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services: fanned deck of the six services */}
      {/* wider than the page container (like the home arrival cards); the section clips sideways overflow
          so tilted card corners never cause a horizontal scrollbar */}
      <section aria-labelledby="list-title" className="section overflow-x-clip">
        <div className="container-fluid [--container:112rem]">
          <div className="relative">
            {/* heading stays at the normal page width; only the cards below use the wider container */}
            <div className="stack mx-auto w-full max-w-[80rem] [--stack-gap:var(--space-xs)]">
              <h2 id="list-title" className="text-h2 font-semibold">What&apos;s included, and what you can add.</h2>
              <p className="max-w-[52ch] text-muted-foreground">The shuttle comes with every booking. Everything else is your choice.</p>
            </div>

            <ServicesFan />
          </div>
        </div>
      </section>

      {/* CTA: same help card and notched tiles as the about and FAQ pages */}
      <section aria-labelledby="services-cta" className="pb-section">
        <div className="container-fluid [--container:96rem]">
          {/* scroll animation: panel rises, copy fades up, tiles rise 1-2-3, notch arrows pop (see .anim-help in globals.css) */}
          <Reveal className="anim-help relative isolate grid gap-l overflow-hidden rounded-card bg-ink p-l text-ink-foreground lg:p-xl xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] xl:items-center">
            <InkGrid />
            <div className="help-copy stack [--stack-gap:var(--space-xs)]">
              <h2 id="services-cta" className="text-h2 font-semibold">Ready to reserve your spot?</h2>
              <p className="max-w-[36ch] text-ink-muted">
                Book parking at Fiumicino in seconds and make the airport one less thing to worry about.
              </p>
            </div>
            <ul className="grid gap-xs sm:grid-cols-3">
              {actions.map(({ href, Icon, title, body, primary }) => (
                <li key={href} className="help-tile">
                  <NotchTile href={href} Icon={Icon} title={title} body={body} primary={primary} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
