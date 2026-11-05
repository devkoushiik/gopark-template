import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, BadgeCheckIcon, BusIcon, CalendarCheckIcon, CctvIcon, MapPinIcon, MessageCircleIcon, PhoneIcon, RouteIcon, SquareParkingIcon, type LucideIcon } from "lucide-react"

import { StatsStrip } from "@/components/home/home-sections"
import { Reveal } from "@/components/home/reveal"
import { InkGrid } from "@/components/layout/ink-grid"
import { NotchTile } from "@/components/layout/notch-tile"
import { CtaRoute } from "@/components/home/cta-route"
import { ParkingTapes } from "@/components/home/parking-tapes"
import { CONTACT } from "@/lib/constants"
import { DotPattern } from "@/components/layout/dot-pattern"

export const metadata: Metadata = {
  title: "About us — GoPark",
  description: "The official car park for Rome Fiumicino since 2024. 6 minutes from Terminals 1 & 3.",
}

// tape band: facts from this page, short enough to read in motion
const TAPE_WORDS = ["Official since 2024", "Monitored 24/7", "Free shuttle", "6 min to T1 & T3", "A91 access", "Fiumicino"]

// Getting here, step by step (from the arrival guide copy)
const JOURNEY = [
  { Icon: RouteIcon, tag: "A91", title: "Exit the A91", body: "Follow the Rome-Fiumicino motorway straight to the car park." },
  { Icon: SquareParkingIcon, tag: "GoPark", title: "Check in and park", body: "Check in at the reception booth. An attendant shows you your row." },
  { Icon: BusIcon, tag: "T1 & T3", title: "Ride the free shuttle", body: "To Terminals 1 & 3 in about 6 minutes." },
]

// Condensed from the operator's previous "Who we are" page; verify before launch.
// abstract blue media band per card (layered soft gradients, no image needed)
const BANDS = [
  // deep navy base, brand blue glow top-left, cyan hint bottom-right
  "radial-gradient(55% 90% at 12% 0%, rgb(37 99 235 / 0.75), transparent 70%), radial-gradient(50% 80% at 90% 100%, rgb(34 211 238 / 0.35), transparent 70%), linear-gradient(135deg, #101a3a, #0b0f19)",
  // deep navy base, teal glow top-right, blue hint bottom-left
  "radial-gradient(55% 90% at 88% 0%, rgb(20 184 166 / 0.55), transparent 70%), radial-gradient(50% 80% at 10% 100%, rgb(37 99 235 / 0.5), transparent 70%), linear-gradient(135deg, #0b0f19, #0f2a3a)",
  // deep navy base, sky glow at the top, indigo-blue hint bottom-right
  "radial-gradient(60% 90% at 50% 0%, rgb(78 168 242 / 0.6), transparent 70%), radial-gradient(50% 80% at 90% 100%, rgb(29 63 158 / 0.9), transparent 70%), linear-gradient(135deg, #0e1730, #0b0f19)",
]
// faint diagonal line texture laid over every band
const BAND_TEXTURE = "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.05) 0 1px, transparent 1px 10px)"

const PILLARS = [
  {
    icon: CctvIcon,
    title: "Security you can check",
    tab: "Security",
    stat: "24/7", statLabel: "support",
    body: "Video surveillance covers the entire site, and customer service is available 24/7.",
  },
  {
    icon: BusIcon,
    title: "6 minutes to your terminal",
    tab: "Shuttle",
    stat: "6 min", statLabel: "to T1 & T3",
    body: "A free shuttle runs to Terminals 1 & 3 every 15-20 minutes, 24 hours a day. The journey takes just a few minutes.",
  },
  {
    icon: RouteIcon,
    title: "Easy to reach, always open",
    tab: "Access",
    stat: "A91", statLabel: "direct",
    body: "Direct access from the A91 Rome-Fiumicino motorway. Open 24 hours a day, whatever time your flight departs or lands.",
  },
]

export default function AboutPage() {
  const phone = CONTACT.phones[0]
  const actions = [
    { href: "/booking", Icon: CalendarCheckIcon, title: "Book parking", body: "A couple of minutes online.", primary: true },
    { href: "/contact", Icon: MessageCircleIcon, title: "Contact us", body: "Message the team." },
    { href: `tel:+39${phone.replace(/\s/g, "")}`, Icon: PhoneIcon, title: phone, body: "Call us, open 24/7." },
  ]

  return (
    <>
      {/* Hero: same treatment as the contact hero (edge arcs, location pill); real airport photo for trust */}
      <section aria-labelledby="about-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
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
                <MapPinIcon aria-hidden className="size-4" />
                Rome Fiumicino
              </p>
              <h1 id="about-title" className="max-w-[13ch] text-hero font-bold">
                Fiumicino&apos;s official car park.
              </h1>
              <p className="max-w-[48ch] text-lg text-white/80">
                The official parking facility for Rome Fiumicino Airport since 2024, completely renovated for
                quality, comfort and security. From booking online to picking up your car, parking stays easy,
                safe and stress-free.
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

          {/* real airport photo with two floating trust cards */}
          <figure className="relative mx-auto w-full max-w-[36rem] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:delay-150 motion-safe:duration-700 motion-safe:fill-mode-both">
            <div className="overflow-hidden rounded-card ring-1 ring-white/10 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)]">
              <Image
                src="/images/fco-terminal.webp"
                alt="Departures hall at Rome Fiumicino Airport, with shops, escalators and travellers with luggage"
                width={1400}
                height={933}
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="aspect-[4/3] h-auto w-full object-cover"
              />
            </div>
            <figcaption className="sr-only">Rome Fiumicino Airport</figcaption>
            <TrustCard className="-bottom-5 -left-3 sm:-left-6" Icon={BadgeCheckIcon} title="Official since 2024" body="Fiumicino Airport car park" />
            <TrustCard className="-top-5 -right-3 sm:-right-6" Icon={CctvIcon} title="Monitored 24/7" body="Video surveillance on site" />
          </figure>
        </div>
      </section>

      <StatsStrip />

      {/* Why GoPark: three reasons as cards, the first highlighted */}
      <section aria-labelledby="why-title" className="section">
        <div className="container-fluid stack [--stack-gap:var(--space-l)]">
          <div className="stack [--stack-gap:var(--space-xs)]">
            <h2 id="why-title" className="text-h2 font-semibold">Why travellers park with us.</h2>
            <p className="max-w-[52ch] text-muted-foreground">Security, speed and easy access, whatever time you fly.</p>
          </div>
          {/* white cards: abstract media band with a label, a white stat tab cut into its corner, big title */}
          {/* swipeable row on mobile and tablet, three across from lg */}
          <ul className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-s overflow-x-auto px-gutter pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
            {PILLARS.map(({ icon: Icon, title, body, tab, stat, statLabel }, i) => (
              <Reveal
                as="li"
                plain
                key={title}
                delay={i * 160}
                className="pop-card flex w-[82%] shrink-0 snap-start flex-col rounded-[1.75rem] border bg-card p-xs shadow-sm sm:w-[55%] md:w-[42%] lg:w-auto"
              >
                <div className="relative h-40 rounded-[1.25rem]" style={{ background: `${BAND_TEXTURE}, ${BANDS[i]}` }}>
                  <span className="pop-tab absolute top-s left-s inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                    <Icon aria-hidden className="size-4" />
                    {tab}
                  </span>
                  {/* stat tab: white notch in the bottom-right corner, joined by two concave curves */}
                  <span className="pop-stat absolute right-0 bottom-0 flex items-baseline gap-2 rounded-tl-2xl bg-card px-4 pt-2.5 pb-1">
                    <span aria-hidden className="absolute bottom-0 -left-4 size-4 bg-[radial-gradient(circle_at_0_0,transparent_1rem,var(--card)_1rem)]" />
                    <span aria-hidden className="absolute right-0 -top-4 size-4 bg-[radial-gradient(circle_at_0_0,transparent_1rem,var(--card)_1rem)]" />
                    <span className="text-sm text-muted-foreground">{statLabel}</span>
                    <span className="text-2xl font-bold tracking-tight text-ink tabular">{stat}</span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-m px-s pt-m pb-s">
                  <strong className="text-h2 leading-[1.05] font-bold tracking-tight text-balance">{title}</strong>
                  <p className="mt-auto text-sm text-muted-foreground">{body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* crossed tapes between the reasons and the route, with about-page facts */}
      <ParkingTapes words={TAPE_WORDS} />

      {/* Route: three-step journey beside the same animated route as the home page CTA */}
      <section aria-labelledby="route-title" className="section">
        <div className="container-fluid grid items-center gap-xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="stack [--stack-gap:var(--space-l)]">
            <div className="stack [--stack-gap:var(--space-xs)]">
              <h2 id="route-title" className="text-h2 font-semibold">Getting here.</h2>
              <p className="max-w-[52ch] text-muted-foreground">
                From the motorway to your terminal in three steps.
              </p>
            </div>
            {/* timeline synced to the 6s shuttle loop on the right: the line fills and each stop lights up as the bus passes it */}
            <ol className="grid gap-m">
              {JOURNEY.map(({ Icon, tag, title, body }, i) => (
                <li key={title} className="relative flex gap-s">
                  {i < JOURNEY.length - 1 && (
                    <span aria-hidden className="absolute top-11 bottom-[calc(-1*var(--space-m))] left-[calc(1.375rem-1px)] w-0.5 bg-border">
                      <span data-step={i + 1} className="journey-fill block size-full bg-primary" />
                    </span>
                  )}
                  <span
                    data-step={i + 1}
                    className="journey-node relative z-10 grid size-11 shrink-0 place-items-center rounded-full"
                  >
                    <Icon aria-hidden className="size-5" />
                    <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-ink text-[0.65rem] font-bold text-white tabular">
                      {i + 1}
                    </span>
                  </span>
                  <span className="stack [--stack-gap:var(--space-3xs)] pt-1">
                    <span className="flex flex-wrap items-center gap-x-xs gap-y-3xs">
                      <span className="font-semibold">{title}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">{tag}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">{body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative isolate overflow-hidden rounded-card bg-ink p-l ring-1 ring-black/5">
            {/* same grid + glow as the other dark panels */}
            <InkGrid corner />
            <CtaRoute className="mx-auto max-w-[26rem]" />
          </div>
        </div>
      </section>

      {/* CTA: same help card and notched tiles as the bottom of the FAQ page */}
      <section aria-labelledby="about-cta" className="pb-section">
        <div className="container-fluid [--container:96rem]">
          {/* scroll animation: panel rises, copy fades up, tiles rise 1-2-3, notch arrows pop (see .anim-help in globals.css) */}
          <Reveal className="anim-help relative isolate grid gap-l overflow-hidden rounded-card bg-ink p-l text-ink-foreground lg:p-xl xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] xl:items-center">
            <InkGrid />
            <div className="help-copy stack [--stack-gap:var(--space-xs)]">
              <h2 id="about-cta" className="text-h2 font-semibold">Ready to park with us?</h2>
              <p className="max-w-[36ch] text-ink-muted">Book online in a couple of minutes, or talk to our team.</p>
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

/** Small white card floating over the hero photo. */
function TrustCard({ Icon, title, body, className }: { Icon: LucideIcon; title: string; body: string; className?: string }) {
  return (
    <div className={"absolute flex items-center gap-xs rounded-2xl bg-white py-2.5 pr-4 pl-2.5 text-ink shadow-[0_16px_40px_-12px_rgb(0_0_0/0.5)] " + className}>
      <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-primary">
        <Icon aria-hidden className="size-4.5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{body}</span>
      </span>
    </div>
  )
}
