import Image from "next/image"
import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  PlusIcon,
  ArrowUpIcon,
  BusIcon,
  CameraIcon,
  CctvIcon,
  CheckIcon,
  CircleAlertIcon,
  ClockIcon,
  CreditCardIcon,
  DropletsIcon,
  FileSignatureIcon,
  HouseIcon,
  MapIcon,
  PlaneIcon,
  KeyRoundIcon,
  MessageCircleIcon,
  ReceiptIcon,
  SmartphoneIcon,
  UserIcon,
  UserRoundCheckIcon,
  WarehouseIcon,
} from "lucide-react"

import { ArrivalVideo } from "@/components/home/arrival-video"
import { CtaRoute } from "@/components/home/cta-route"
import { FaqArt } from "@/components/home/faq-art"
import { FlapBoard } from "@/components/home/flap-board"
import { HeroVideo } from "@/components/home/hero-video"
import { Reveal } from "@/components/home/reveal"
import { VideoTestimonials } from "@/components/home/video-testimonials"
import {
  IsoAttendant,
  IsoBookingCard,
  IsoCalendar,
  IsoCheckIn,
  IsoParking,
  IsoPhotos,
  IsoStall,
  IsoUnload,
} from "@/components/home/iso-scenes"
import { SectionHeading } from "@/components/home/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button, buttonVariants } from "@/components/ui/button"
import { CardSlider } from "@/components/ui/card-slider"
import {
  APP_FEATURES,
  ARRIVAL_STEPS,
  BOOKING_STEPS,
  CANCELLATION,
  FINAL_CTA,
  PARKING_NOTICE,
  READY_TO_GO,
  ROW_RULES,
  SERVICES,
  STATS,
} from "@/lib/content"
import { FAQS } from "@/lib/faq"


/* ------------------------------------------------------------------ */
/* Stats strip                                                         */
/* ------------------------------------------------------------------ */
export function StatsStrip({ startOn, className }: { startOn?: string; className?: string }) {
  return <FlapBoard stats={STATS} startOn={startOn} className={className} />
}

/* ------------------------------------------------------------------ */
/* How booking works                                                   */
/* ------------------------------------------------------------------ */
// Poster cards: animated isometric scene, one huge word, small note.
const STEP_POSTERS = [
  { Scene: IsoCalendar, tone: "bg-ink text-ink-foreground", note: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.3)" },
  { Scene: IsoBookingCard, tone: "bg-[#171a21] text-ink-foreground", note: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.22)" },
  { Scene: IsoParking, tone: "bg-ink text-ink-foreground", note: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.3)" },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section">
      <div className="container-fluid stack [--stack-gap:var(--space-l)]">
        <SectionHeading
          id="how-title"
          title="Booked in three steps."
          description="No account needed. Your summary updates as you go."
        />
        {/* swipeable row on mobile and tablet, three across from lg */}
        <ol className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-s overflow-x-auto px-gutter pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0">
          {BOOKING_STEPS.map(({ word, title, body }, i) => {
            const { Scene, tone, note, line, glow } = STEP_POSTERS[i]
            return (
              <Reveal
                as="li"
                key={title}
                delay={i * 140}
                className={`group relative isolate flex aspect-[3/4] w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-card p-m transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgb(11_15_25/0.55)] motion-reduce:transition-none sm:w-[46%] md:w-[42%] lg:w-auto ${tone}`}
              >
                {/* isometric graph paper (30° / 150°, same angles as the scene) + light pool, fading out above the title */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_45%,transparent_85%)]"
                  style={{
                    backgroundImage: `radial-gradient(65% 50% at 50% 38%, ${glow}, transparent 70%), repeating-linear-gradient(30deg, ${line} 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, ${line} 0 1px, transparent 1px 22px)`,
                  }}
                />
                <div className="flex flex-1 items-center justify-center">
                  {/* zoomed on the narrow swipe cards; from lg the cards are wide, so shrink to sit inside the padding */}
                  <Scene className="w-full max-w-[26rem] scale-[1.22] lg:scale-[0.88]" />
                </div>
                <div>
                  <h3 className="text-[clamp(2.75rem,2rem+3vw,4.5rem)] leading-[0.95] font-bold tracking-tight">
                    {word}
                    <span className="sr-only"> {title}</span>
                  </h3>
                  <p className={`mt-s max-w-[30ch] text-sm leading-snug ${note}`}>{body}</p>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Services bento                                                      */
/* ------------------------------------------------------------------ */
const ARRIVAL_SCENES = [IsoUnload, IsoCheckIn, IsoAttendant, IsoPhotos]

// poster: still photo shown first, and kept on slow connections / data saver
const ARRIVAL_IMAGES: ({ src: string; poster?: string; posterWidth?: number; alt: string; pos?: string; overlay?: boolean | number; shift?: string; origin?: string } | null)[] = [
  { src: "/videos/arrive-unload.mp4", poster: "/images/arrive-unload.webp", alt: "Traveller and attendant unloading suitcases from a blue car in a parking bay", overlay: true },
  { src: "/videos/check-in.mp4", poster: "/images/check-in-booth.webp", posterWidth: 800, alt: "Driver handing a phone to the attendant at the reception booth by the entry barrier", pos: "50% 30%", overlay: true },
  { src: "/videos/wait-for-staff.mp4", poster: "/images/wait-for-staff.webp", alt: "Attendant in a hi-vis vest pointing a driver toward the parking rows", pos: "0% 40%", overlay: true, shift: "scale(1.12)", origin: "bottom left" },
  { src: "/videos/photograph-car.mp4", poster: "/images/photograph-car.webp", alt: "Driver photographing a parked car from four angles with a tablet", overlay: true },
]

// Tone per step: pale blue -> brand blue -> navy -> white
// all arrival cards share the dark "Wait for staff" treatment
// ink card framed by a solid black border
const LANE_CARD = "bg-ink text-ink-foreground border-[3px] border-neutral-950"

const ARRIVAL_TONES = [
  { card: LANE_CARD, body: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.32)" },
  { card: LANE_CARD, body: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.32)" },
  { card: LANE_CARD, body: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.32)" },
  { card: LANE_CARD, body: "text-ink-muted", line: "rgb(255 255 255 / 0.07)", glow: "rgb(37 99 235 / 0.32)" },
]

const SERVICE_ICONS: Record<string, typeof BusIcon> = {
  shuttle: BusIcon,
  covered: WarehouseIcon,
  valet: UserRoundCheckIcon,
  keys: KeyRoundIcon,
}

export function ServiceGrid() {
  return (
    <section id="services" aria-labelledby="services-title" className="section section-defer border-y bg-secondary">
      <div className="container-fluid stack [--stack-gap:var(--space-l)]">
        <SectionHeading id="services-title" title="Everything your car needs while you're away." />
        {/* feature panel + one spec panel; equal height, shared edges */}
        <div className="grid gap-s lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* pinned photo: same board vibe as the notes */}
          <Reveal className="group relative pt-xs transition-[rotate,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:rotate-0 motion-reduce:transition-none">
            {[
              { pos: "left-1/2 -translate-x-1/2", color: "bg-[#e5484d]" },
            ].map(({ pos, color }) => (
              <span key={pos} aria-hidden className={`absolute top-0 z-10 ${pos}`}>
                <span className="absolute top-3.5 left-2 h-2 w-4 rotate-[25deg] rounded-full bg-ink/30 blur-[3px]" />
                <span className={`relative block size-5 rounded-full ${color} shadow-[inset_-2px_-3px_4px_rgb(0_0_0/0.35),0_2px_3px_rgb(11_15_25/0.35)] transition-transform duration-300 group-hover:scale-90`}>
                  <span className="absolute top-1 left-1 size-1.5 rounded-full bg-white/70" />
                </span>
              </span>
            ))}
          <div className="relative isolate flex h-full min-h-[clamp(30rem,38vw,38rem)] flex-col overflow-hidden rounded-card bg-ink p-m text-ink-foreground shadow-[0_24px_40px_-18px_rgb(11_15_25/0.5)] ring-4 ring-card">
            {/* security footage + dark overlay (heavier at the bottom where the text sits) */}
            <HeroVideo src="/videos/security.mp4" className="absolute inset-0 -z-20 size-full object-cover" />
            <span
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(11_15_25/0.92)_0%,rgb(11_15_25/0.6)_45%,rgb(11_15_25/0.35)_100%)]"
            />
            <span className="grid size-11 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <CctvIcon aria-hidden className="size-5" />
            </span>
            <div className="mt-auto pt-xl">
              <h3 className="text-h2 font-semibold">{SERVICES.featured.title}</h3>
              <p className="mt-xs max-w-[42ch] text-ink-muted">{SERVICES.featured.body}</p>
            </div>
          </div>
          </Reveal>

          {/* pinboard: separate notes, each tacked on with a push-pin; they rise in one after another as the grid scrolls into view */}
          <ul className="grid gap-x-s gap-y-m pt-xs sm:grid-cols-2">
            {SERVICES.items.map(({ key, title, body }, i) => {
              const Icon = SERVICE_ICONS[key]
              const pin = i === 1 || i === 2 ? "bg-ink" : "bg-primary" // diagonal pair of dark pins in the 2x2 grid
              return (
                <Reveal
                  as="li"
                  key={key}
                  delay={160 + (i % 2) * 120}
                  className="group relative isolate flex flex-col justify-center gap-m rounded-2xl bg-card p-m pt-l shadow-[0_1px_0_rgb(11_15_25/0.04),0_14px_28px_-16px_rgb(11_15_25/0.35)] ring-1 ring-border transition-[rotate,translate,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_24px_40px_-18px_rgb(37_99_235/0.35)] motion-reduce:transition-none"
                >
                  {/* soft concentric circles in the top-right corner, cropped by the card's rounded edge; they fill the empty corner and swell a little on hover */}
                  <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl">
                    <span className="absolute -top-16 -right-16 size-48 rounded-full bg-brand-soft/50 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
                    <span className="absolute -top-9 -right-9 size-32 rounded-full bg-brand-soft/80 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
                    <span className="absolute -top-3 -right-3 size-16 rounded-full bg-brand-soft transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125" />
                  </span>
                  {/* push-pin: glossy head + short shadow cast on the card */}
                  <span aria-hidden className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                    <span className="absolute top-3.5 left-2 h-2 w-4 rotate-[25deg] rounded-full bg-ink/25 blur-[3px] transition-opacity group-hover:opacity-40" />
                    <span
                      className={`relative block size-5 rounded-full ${pin} shadow-[inset_-2px_-3px_4px_rgb(0_0_0/0.35),0_2px_3px_rgb(11_15_25/0.35)] transition-transform duration-300 group-hover:scale-90`}
                    >
                      <span className="absolute top-1 left-1 size-1.5 rounded-full bg-white/70" />
                    </span>
                  </span>
                  <span className="grid size-16 place-items-center rounded-full bg-brand-soft text-brand-soft-foreground">
                    <Icon aria-hidden className="size-7" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{body}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Arrival guide + row rules                                           */
/* ------------------------------------------------------------------ */

export function ArrivalGuide() {
  return (
    <section id="arrival" aria-labelledby="arrival-title" className="section section-defer">
      {/* wider than the page container so four cards fit in a row at a good size */}
      <div className="container-fluid stack [--container:112rem] [--stack-gap:var(--space-xl)]">
        <CardSlider
          label="Arrival steps"
          lgPerView={4}
          autoPlay={5000}
          // cards use the wide container, but the title (and arrows) stay on the normal page width like every other section
          headerClassName="mx-auto w-[min(100%,80rem)]"
          header={
            <SectionHeading
              id="arrival-title"
              eyebrow="Arrival guide"
              title="On the day: four quick steps."
              description="From the gate to the shuttle in a few minutes."
            />
          }
        >
          {ARRIVAL_STEPS.map(({ title, body }, i) => {
            const tone = ARRIVAL_TONES[i]
            const Scene = ARRIVAL_SCENES[i]
            return (
              <Reveal
                as="li"
                key={title}
                delay={i * 120}
                className={`group relative isolate flex min-h-[clamp(26rem,34vw,32rem)] flex-col overflow-hidden rounded-card border p-m transition-shadow duration-500 hover:shadow-[0_24px_48px_-24px_rgb(11_15_25/0.5)] ${tone.card}`}
              >
                {/* isometric graph paper + light pool behind the scene, fading above the text */}
                {!ARRIVAL_IMAGES[i] && (
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_50%,transparent_85%)]"
                    style={{
                      backgroundImage: `radial-gradient(60% 45% at 50% 40%, ${tone.glow}, transparent 70%), repeating-linear-gradient(30deg, ${tone.line} 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, ${tone.line} 0 1px, transparent 1px 22px)`,
                    }}
                  />
                )}
                {ARRIVAL_IMAGES[i] ? (
                  // rendered artwork where we have it; falls back to the iso scene
                  <div className="relative -mx-m -mt-m mb-s flex-1 overflow-hidden [mask-image:linear-gradient(to_bottom,black_45%,rgb(0_0_0/0.85)_60%,rgb(0_0_0/0.55)_74%,rgb(0_0_0/0.25)_86%,rgb(0_0_0/0.08)_94%,transparent)]">
                    {ARRIVAL_IMAGES[i]!.src.endsWith(".mp4") ? (
                      <ArrivalVideo
                        src={ARRIVAL_IMAGES[i]!.src}
                        poster={ARRIVAL_IMAGES[i]!.poster!}
                        posterWidth={ARRIVAL_IMAGES[i]!.posterWidth}
                        hdSrc={ARRIVAL_IMAGES[i]!.src.replace(".mp4", "-hd.mp4")}
                        alt={ARRIVAL_IMAGES[i]!.alt}
                        style={{
                          objectPosition: ARRIVAL_IMAGES[i]!.pos ?? "50% 40%",
                          // nudge the scene past the object-position limits
                          transform: ARRIVAL_IMAGES[i]!.shift,
                          transformOrigin: ARRIVAL_IMAGES[i]!.origin,
                        }}
                      />
                    ) : (
                      <Image
                        src={ARRIVAL_IMAGES[i]!.src}
                        alt={ARRIVAL_IMAGES[i]!.alt}
                        fill
                        sizes="(min-width: 768px) 25vw, 80vw"
                        className="object-cover"
                        style={{ objectPosition: ARRIVAL_IMAGES[i]!.pos ?? "50% 40%" }}
                      />
                    )}
                    {ARRIVAL_IMAGES[i]!.overlay && (
                      // true = default 15% black; a number sets a custom strength
                      <div aria-hidden className="absolute inset-0 bg-black" style={{ opacity: ARRIVAL_IMAGES[i]!.overlay === true ? 0.15 : (ARRIVAL_IMAGES[i]!.overlay as number) }} />
                    )}
                    {/* soft film grain over the footage; static so it costs nothing per frame */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-1 items-center justify-center py-s">
                    <Scene className="w-full max-w-[19rem]" />
                  </div>
                )}
                <div>
                  <h3 className="text-h2 font-semibold">
                    <span className="sr-only">Step {i + 1}: </span>
                    {title}
                  </h3>
                  <p className={`mt-xs ${tone.body}`}>{body}</p>
                </div>
              </Reveal>
            )
          })}
        </CardSlider>

        {/* Row direction rules: one panel, two halves */}
        {/* back to the normal page width; only the arrival cards above use the wider container */}
        <div className="stack mx-auto w-full max-w-[80rem] [--stack-gap:var(--space-m)]" aria-labelledby="rows-title">
          <h3 id="rows-title" className="text-h2 font-semibold">
            Park in your assigned row
          </h3>
          <ul className="grid gap-s md:grid-cols-2">
            {ROW_RULES.map((r) => {
              const forward = r.key === "even"
              const Arrow = forward ? ArrowUpIcon : ArrowDownIcon
              return (
                <li
                  key={r.key}
                  className="@container relative isolate flex min-h-[clamp(28rem,40vw,34rem)] flex-col overflow-hidden rounded-card bg-ink p-m text-ink-foreground"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent_90%)]"
                    style={{
                      backgroundImage:
                        "radial-gradient(60% 45% at 50% 48%, rgb(37 99 235 / 0.35), transparent 70%), repeating-linear-gradient(30deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 22px)",
                    }}
                  />
                  <div className="flex items-start justify-between gap-s">
                    <div>
                      <h4 className="text-h2 font-semibold">{r.title}</h4>
                      <p className="mt-1 text-sm text-ink-muted tabular">{r.rows}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                      <Arrow aria-hidden className="size-4" />
                      {r.mode}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-center py-s">
                    <IsoStall mode={forward ? "forward" : "reverse"} className="w-full max-w-[22rem] scale-110" />

                  </div>
                  {/* one frosted panel, rules side by side */}
                  <ul className="grid divide-y divide-white/10 rounded-xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-sm @md:grid-cols-2 @md:divide-x @md:divide-y-0">
                    {r.rules.map((rule) => (
                      <li key={rule} className="flex items-center gap-xs p-s text-sm text-ink-foreground/90 text-pretty">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                          <CheckIcon aria-hidden className="size-3.5" strokeWidth={3} />
                        </span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>

          {/* matched pair of callouts: same shape, different intent */}
          <div className="grid gap-s lg:grid-cols-2">
            <div role="note" className="flex gap-s rounded-card bg-destructive-surface p-m">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-destructive shadow-sm">
                <CircleAlertIcon aria-hidden className="size-5" />
              </span>
              <div>
                <p className="font-semibold">Never park on your own</p>
                <p className="mt-1 text-sm text-ink/70">{PARKING_NOTICE}</p>
              </div>
            </div>
            <div className="flex gap-s rounded-card bg-brand-soft p-m">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-primary shadow-sm">
                <BusIcon aria-hidden className="size-5" />
              </span>
              <div>
                <p className="font-semibold">Ready to go</p>
                <p className="mt-1 text-sm text-ink/70">{READY_TO_GO}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Cancellation                                                        */
/* ------------------------------------------------------------------ */
/** 24-hour dial: one tick per hour, the blue arc sweeps the cancellation window on reveal. */
function CancelDial() {
  const ticks = Array.from({ length: 24 }, (_, h) => h)
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[17rem]">
      <svg viewBox="0 0 200 200" aria-hidden className="size-full -rotate-90">
        <circle cx="100" cy="100" r="78" fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r="78"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="14"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          className="cancel-arc"
        />
        {ticks.map((h) => {
          const a = (h / 24) * Math.PI * 2
          const major = h % 6 === 0
          const r1 = major ? 56 : 60
          return (
            <line
              key={h}
              x1={100 + Math.cos(a) * r1}
              y1={100 + Math.sin(a) * r1}
              x2={100 + Math.cos(a) * 65}
              y2={100 + Math.sin(a) * 65}
              stroke={major ? "rgb(255 255 255 / 0.7)" : "rgb(255 255 255 / 0.25)"}
              strokeWidth={major ? 2 : 1.25}
              strokeLinecap="round"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="tabular text-[clamp(3rem,2.4rem+2.4vw,4.25rem)] leading-none font-semibold tracking-tighter">
          24<span className="text-white/50">h</span>
        </span>
        {/* lg..xl the ring is too small to hold the caption: drop it just below the dial */}
        <span className="mt-1 text-sm text-white/60 lg:max-xl:absolute lg:max-xl:inset-x-0 lg:max-xl:top-full lg:max-xl:mt-xs">
          to change your mind
        </span>
      </div>
    </div>
  )
}

export function CancellationPolicy() {
  const [windowRule, help, refund] = CANCELLATION
  return (
    <section aria-labelledby="cancel-title" className="section section-defer border-t bg-secondary">
      <div className="container-fluid mb-l stack [--stack-gap:var(--space-xs)]">
        <h2 id="cancel-title" className="text-h2 font-semibold tracking-tight text-balance">
          Plans changed? Cancel easily.
        </h2>
        <p className="max-w-[52ch] text-muted-foreground">Simple and transparent, with no hidden conditions.</p>
      </div>
      <div className="container-fluid">
        <Reveal className="cancel-card grid overflow-hidden rounded-card bg-ink text-white lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)_minmax(0,1fr)]">
          {/* copy */}
          <div className="flex flex-col justify-center gap-l p-l">
            <ul className="stack [--stack-gap:var(--space-m)]">
              {[
                { Icon: ClockIcon, rule: windowRule },
                { Icon: MessageCircleIcon, rule: help },
                { Icon: CreditCardIcon, rule: refund },
              ].map(({ Icon, rule }) => (
                <li key={rule.key} className="flex items-start gap-s">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-[#93b4ff] ring-1 ring-primary/30">
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="text-sm">
                    <strong className="block font-semibold text-white">{rule.title}</strong>
                    <span className="text-white/60">{rule.body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={`${buttonVariants({ size: "lg" })} group w-fit rounded-full shadow-[0_12px_28px_-12px_rgb(37_99_235/0.8)] active:scale-[0.97]`}
            >
              Contact the team
              <ArrowRightIcon aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* dial on iso graph paper */}
          <div
            className="relative grid place-items-center border-y border-white/10 p-l lg:border-y-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgb(37 99 235 / 0.28), transparent 62%), repeating-linear-gradient(30deg, rgb(255 255 255 / 0.05) 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, rgb(255 255 255 / 0.05) 0 1px, transparent 1px 22px)",
            }}
          >
            <CancelDial />
            {/* wavy column dividers */}
            {["left-0 -translate-x-1/2", "right-0 translate-x-1/2"].map((pos) => (
              <span
                key={pos}
                aria-hidden
                className={`pointer-events-none absolute inset-y-0 hidden w-3 lg:block ${pos}`}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E%3Cpath d='M6 0 Q0 6 6 12 T6 24' fill='none' stroke='white' stroke-opacity='0.22' stroke-width='1.5'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat-y" }}
              />
            ))}
          </div>

          {/* refund receipt */}
          <div className="grid place-items-center p-l">
            <div
              className="cancel-receipt w-full max-w-[19rem] rounded-t-2xl bg-card px-m pt-m pb-l text-foreground shadow-[0_24px_48px_-20px_rgb(0_0_0/0.6)]"
            >
              <div className="flex items-center gap-xs">
                <span className="grid size-9 place-items-center rounded-full bg-success-surface text-success">
                  <CheckIcon aria-hidden className="size-4" />
                </span>
                <span>
                  <span className="block font-semibold">Refund issued</span>
                  <span className="block text-xs text-muted-foreground">Cancelled within 24 hours</span>
                </span>
              </div>
              <dl className="tabular stack mt-m border-t border-dashed pt-s text-sm [--stack-gap:var(--space-2xs)]">
                <div className="flex justify-between gap-s">
                  <dt className="text-muted-foreground">Booking paid</dt>
                  <dd>100%</dd>
                </div>
                <div className="flex justify-between gap-s">
                  <dt className="text-muted-foreground">Confirmation</dt>
                  <dd>In your inbox</dd>
                </div>
              </dl>
              <div className="mt-s flex items-baseline justify-between gap-s border-t border-dashed pt-s">
                <span className="text-sm font-semibold">You get back</span>
                <span className="font-semibold text-primary tabular">The rest</span>
              </div>
              <p className="mt-m flex items-center gap-xs text-xs text-muted-foreground">
                <CreditCardIcon aria-hidden className="size-4 shrink-0 text-primary" />
                To your original payment method
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */
const APP_ICONS: Record<string, typeof ReceiptIcon> = {
  photos: CameraIcon,
  shuttle: BusIcon,
  receipts: FileSignatureIcon,
}

// decorative QR-looking pattern: three finder squares + deterministic noise
const QR = Array.from({ length: 81 }, (_, i) => {
  const x = i % 9
  const y = Math.floor(i / 9)
  const inFinder = (x < 3 && y < 3) || (x > 5 && y < 3) || (x < 3 && y > 5)
  if (inFinder) return true
  return (x * 7 + y * 13 + x * y) % 3 === 0
})

const MAP_ROUTE = "M14 64 C 40 64, 44 30, 80 34 S 120 14, 150 14"

// phone feed, one per app feature; the first repeats at the end so the loop is seamless
const APP_UPDATES = [
  { Icon: BusIcon, title: "Shuttle on the way", meta: "Pick-up point B, 3 min" },
  { Icon: KeyRoundIcon, title: "Car parked", meta: "Row 14, keys with you" },
  { Icon: DropletsIcon, title: "Car wash done", meta: "Ready for Monday" },
  { Icon: FileSignatureIcon, title: "Receipt signed", meta: "Saved to your trips" },
]

function PhoneMock() {
  return (
    <div aria-hidden className="relative isolate mx-auto w-full max-w-[24rem] md:[zoom:0.85] xl:[zoom:1]">

      {/* phone */}
      <div className="relative mx-auto aspect-[9/17.5] w-[16.5rem] rounded-[3rem] sm:w-[18rem] sm:rotate-[14deg] md:rotate-[10deg] xl:rotate-[14deg] bg-ink p-[0.55rem] shadow-[0_40px_80px_-24px_rgb(11_15_25/0.55)] ring-1 ring-white/15">
        {/* side buttons */}
        <span className="absolute top-[22%] -left-[3px] h-8 w-[3px] rounded-l bg-ink" />
        <span className="absolute top-[32%] -left-[3px] h-12 w-[3px] rounded-l bg-ink" />
        <span className="absolute top-[28%] -right-[3px] h-16 w-[3px] rounded-r bg-ink" />
        <div className="flex h-full flex-col overflow-hidden rounded-[2.45rem] bg-background text-foreground">
          {/* status bar + dynamic island */}
          <div className="relative flex h-10 shrink-0 items-center justify-between px-6 text-[0.62rem] font-semibold tabular">
            <span>9:41</span>
            <span className="absolute top-2.5 left-1/2 h-[1.4rem] w-[5.2rem] -translate-x-1/2 rounded-full bg-ink" />
            <span className="flex items-center gap-1">
              <span className="flex items-end gap-px">
                <span className="h-1 w-[2px] rounded-sm bg-foreground" />
                <span className="h-1.5 w-[2px] rounded-sm bg-foreground" />
                <span className="h-2 w-[2px] rounded-sm bg-foreground" />
              </span>
              <span className="h-2 w-4 rounded-[3px] border border-foreground/60 p-px">
                <span className="block h-full w-3/4 rounded-[1px] bg-foreground" />
              </span>
            </span>
          </div>

          <div className="min-h-0 flex-1 space-y-2.5 overflow-hidden px-3.5 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.6rem] text-muted-foreground">Buongiorno</p>
                <p className="text-sm font-bold">Your trip</p>
              </div>
              <span className="grid size-7 place-items-center rounded-full bg-brand-soft text-[0.6rem] font-bold text-brand-soft-foreground">GP</span>
            </div>

            {/* booking ticket */}
            <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--ink),var(--primary))] p-3 text-primary-foreground">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1 text-[0.55rem] font-semibold tracking-wider text-primary-foreground uppercase">
                    <CheckIcon className="size-3" /> Confirmed
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold tracking-wider">GP-7K3Q-21</p>
                </div>
                <div className="grid grid-cols-9 gap-px rounded-md bg-white p-1">
                  {QR.map((on, i) => (
                    <span key={i} className={on ? "size-1 bg-ink" : "size-1 bg-white"} />
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-dashed border-white/25 pt-2.5 text-[0.6rem]">
                <div>
                  <p className="text-primary-foreground">Drop-off</p>
                  <p className="font-semibold">Fri 09:00</p>
                </div>
                <span className="relative h-px flex-1 bg-white/30">
                  <span className="absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </span>
                <div className="text-right">
                  <p className="text-primary-foreground">Pick-up</p>
                  <p className="font-semibold">Mon 13:00</p>
                </div>
              </div>
            </div>

            {/* live map */}
            <div className="relative overflow-hidden rounded-2xl border bg-secondary">
              <svg viewBox="0 0 164 80" className="app-map block h-auto w-full">
                <path d={MAP_ROUTE} fill="none" stroke="#dbe6ff" strokeWidth="8" strokeLinecap="round" />
                <path d={MAP_ROUTE} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
                <circle cx="14" cy="64" r="5" fill="#2563eb" />
                <rect x="143" y="7" width="14" height="14" rx="4" fill="#0b0f19" />
                <PlaneIcon x={145.5} y={9.5} width={9} height={9} color="#ffffff" strokeWidth={2.2} />
                <g className="app-bus" style={{ offsetPath: `path("${MAP_ROUTE}")` }}>
                  <circle r="6" fill="#2563eb" fillOpacity="0.25" />
                  <circle r="3.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              </svg>
              <span className="absolute bottom-1.5 left-2 rounded-full bg-card px-2 py-0.5 text-[0.55rem] font-semibold text-foreground shadow-sm">
                Shuttle · 3 min
              </span>
            </div>

            <div className="rounded-xl bg-primary py-2 text-center text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30">
              Call shuttle
            </div>

            {/* live updates: one notification at a time, each new one slides up into place */}
            <div>
              <p className="mb-1 flex items-center justify-between text-[0.55rem] font-semibold text-muted-foreground">
                Updates
                <span className="flex items-center gap-1 font-medium text-primary">
                  <span className="app-live size-1.5 rounded-full bg-primary" /> Live
                </span>
              </p>
              <div className="relative h-9 overflow-hidden">
                <ul className="app-feed space-y-1.5">
                  {[...APP_UPDATES, APP_UPDATES[0]].map(({ Icon, title, meta }, i) => (
                    <li key={i} className="flex h-9 items-center gap-2 rounded-xl border bg-card px-2">
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-brand-soft text-primary">
                        <Icon className="size-3" />
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-[0.6rem] font-semibold">{title}</span>
                        <span className="block truncate text-[0.52rem] text-muted-foreground">{meta}</span>
                      </span>
                      <span className="text-[0.5rem] text-muted-foreground tabular">now</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* tab bar */}
          <div className="mx-3 mb-2 flex shrink-0 items-center justify-around rounded-2xl bg-secondary py-2 text-muted-foreground">
            <span className="grid size-7 place-items-center rounded-full bg-primary text-white">
              <HouseIcon className="size-3.5" />
            </span>
            <MapIcon className="size-4" />
            <ReceiptIcon className="size-4" />
            <UserIcon className="size-4" />
          </div>
          <div className="mx-auto mb-2 h-1 w-24 shrink-0 rounded-full bg-foreground/80" />
        </div>
      </div>

      <style>{`
        .app-map .app-bus { offset-distance: 60%; offset-rotate: 0deg; }
        @media (prefers-reduced-motion: no-preference) {
          .app-map .app-bus { animation: app-bus 5s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate; }
          .app-feed { animation: app-feed 10s cubic-bezier(0.7, 0, 0.2, 1) infinite; }
          /* flash each row as it slides in: 2nd, 3rd, 4th, then the loop resets onto the 1st */
          .app-feed > li:nth-child(2) { animation: app-ping 10s ease-out infinite; }
          .app-feed > li:nth-child(3) { animation: app-ping 10s ease-out 2.5s infinite; }
          .app-feed > li:nth-child(4) { animation: app-ping 10s ease-out 5s infinite; }
          .app-feed > li:nth-child(1) { animation: app-ping 10s ease-out 7.5s infinite; }
          .app-live { animation: app-live 1.6s ease-in-out infinite; }
        }
        /* each step lifts the list by one row (h-9 + space-y-1.5 = 2.625rem), then holds */
        @keyframes app-feed {
          0%, 20% { transform: translateY(0); }
          25%, 45% { transform: translateY(-2.625rem); }
          50%, 70% { transform: translateY(-5.25rem); }
          75%, 95% { transform: translateY(-7.875rem); }
          100% { transform: translateY(-10.5rem); }
        }
        /* newest row flashes brand-soft as it lands */
        @keyframes app-ping { 0%, 20% { background: var(--card); } 26% { background: var(--brand-soft); } 40%, 100% { background: var(--card); } }
        @keyframes app-live { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes app-bus { from { offset-distance: 0%; } to { offset-distance: 100%; } }
      `}</style>
    </div>
  )
}

export function AppSection() {
  return (
    <section id="app" aria-labelledby="app-title" className="section section-defer bg-secondary">
      <div className="container-fluid">
        <div className="relative isolate grid rounded-card bg-primary text-white md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:min-h-[30rem]">
          {/* clipped backdrop: lattice + soft circle behind the phone */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-card">
            {/* two-tone split: brighter blue behind the copy, deeper blue behind the phone */}
            <span className="absolute inset-y-0 right-0 bg-primary-hover max-md:top-[55%] max-md:left-0 md:left-[52.4%]" />
            <span
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(30deg, rgb(255 255 255 / 0.08) 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, rgb(255 255 255 / 0.08) 0 1px, transparent 1px 22px)",
              }}
            />
            <span
              className="absolute aspect-square w-[26rem] rounded-full max-md:bottom-[-9rem] max-md:left-1/2 max-md:-translate-x-1/2 md:top-1/2 md:left-[76.2%] md:w-[20rem] md:-translate-x-1/2 md:-translate-y-1/2 xl:w-[26rem]"
              style={{ background: "radial-gradient(circle at 30% 30%, rgb(255 255 255 / 0.55), rgb(255 255 255 / 0.12) 70%)" }}
            />
          </div>

          <div className="stack justify-center px-m py-l sm:px-l md:pr-m lg:p-xl [--stack-gap:var(--space-m)]">
            <div className="stack [--stack-gap:var(--space-xs)]">
              <h2 id="app-title" className="text-h1 font-semibold tracking-tight text-balance">
                Your parking, in your pocket.
              </h2>
              <p className="max-w-[40ch] text-white">Bookings, shuttle and receipts, all from your phone.</p>
            </div>

            <ul className="flex flex-wrap gap-x-l gap-y-xs">
              {APP_FEATURES.map(({ key, title }) => {
                const Icon = APP_ICONS[key]
                return (
                  <li key={key} className="flex items-center gap-2.5 whitespace-nowrap">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="text-sm font-medium">{title}</span>
                  </li>
                )
              })}
            </ul>

            {/* TODO: real store URLs */}
            <div className="cluster">
              <a
                href="#"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#0a0a0a] px-5 font-semibold text-white transition-[transform,background-color] hover:bg-[#1a1a1a] active:scale-[0.98]"
              >
                <SmartphoneIcon aria-hidden className="size-5" /> App Store
              </a>
              <a
                href="#"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#0a0a0a] px-5 font-semibold text-white transition-[transform,background-color] hover:bg-[#1a1a1a] active:scale-[0.98]"
              >
                <SmartphoneIcon aria-hidden className="size-5" /> Google Play
              </a>
            </div>
          </div>

          {/* full phone standing on a soft circle */}
          <div className="relative flex items-center justify-center px-m pt-s pb-l md:px-0 md:py-l xl:-my-20 xl:py-0">
            <PhoneMock />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ + final CTA                                                     */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* Testimonials: pinned video cards                                    */
/* ------------------------------------------------------------------ */

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section section-defer relative isolate border-b">
      {/* soft brand dot pattern, fading in from the top and full at the bottom edge, so this section stands apart from the FAQ below */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]"
        style={{
          backgroundImage: "radial-gradient(rgb(37 99 235 / 0.22) 1.3px, transparent 1.7px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* wider than the page container so four cards fit in a row, same as the arrival guide; the heading sits in the slider header */}
      <div className="container-fluid [--container:112rem]">
        <VideoTestimonials />
      </div>
    </section>
  )
}

export function FaqPreview() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section section-defer">
      <div className="container-fluid mb-l stack max-w-none [--stack-gap:var(--space-xs)]">
        <h2 id="faq-title" className="text-h2 font-semibold tracking-tight text-balance">
          Questions before you park?
        </h2>
        <p className="max-w-[52ch] text-muted-foreground">
          Booking, arrival, the shuttle and getting your car back, answered in one place.
        </p>
      </div>
      <div className="container-fluid grid gap-l lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+var(--space-l))] lg:self-start">
          <FaqArt className="mx-auto max-w-md rounded-card shadow-lg max-lg:max-w-sm" />
        </div>
        <div className="stack lg:self-center [--stack-gap:var(--space-s)]">
          <Accordion className="gap-2xs">
            {FAQS.filter((f) => f.featured).map(({ q, a }) => (
              <AccordionItem
                key={q}
                value={q}
                className="group/faq relative isolate overflow-hidden rounded-2xl border bg-card transition-all duration-300 not-last:border-b hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 data-open:border-ink data-open:bg-ink data-open:text-ink-foreground data-open:shadow-xl data-open:shadow-primary/20"
              >
                {/* blue glow behind the open card */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-10 -z-10 size-48 rounded-full bg-primary/40 opacity-0 blur-3xl transition-opacity duration-500 group-data-open/faq:opacity-100"
                />
                <AccordionTrigger className="min-h-16 items-center gap-s px-s py-s text-base font-semibold hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden">
                  {/* letter tile, like the FAQ artwork */}
                  <span
                    aria-hidden
                    className="relative grid size-11 shrink-0 -rotate-3 place-items-center rounded-lg bg-brand-soft text-lg font-bold text-primary shadow-[inset_0_-3px_0_rgb(37_99_235/0.25)] transition-all duration-300 group-hover/faq:rotate-0 group-data-open/faq:rotate-3 group-data-open/faq:bg-primary group-data-open/faq:text-primary-foreground group-data-open/faq:shadow-[0_0_24px_rgb(37_99_235/0.6)]"
                  >
                    <span className="font-serif text-2xl leading-none italic">?</span>
                  </span>
                  <span className="flex-1">{q}</span>
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 group-data-open/faq:rotate-45 group-data-open/faq:border-primary group-data-open/faq:bg-primary group-data-open/faq:text-primary-foreground"
                  >
                    <PlusIcon className="size-4" />
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pr-s pb-s pl-[calc(var(--space-s)+2.75rem+var(--space-s))] text-ink-muted">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Link
            href="/faq"
            className="group relative isolate flex items-center justify-between gap-s overflow-hidden rounded-2xl bg-primary px-s py-s text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <span
              aria-hidden
              className="absolute inset-0 -z-10 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(30deg, rgb(255 255 255 / 0.08) 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, rgb(255 255 255 / 0.08) 0 1px, transparent 1px 22px)",
              }}
            />
            <span>
              <span className="block text-base font-semibold">Still have questions?</span>
              <span className="block text-sm text-primary-foreground tabular">Browse all {FAQS.length} answers</span>
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-foreground text-primary transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRightIcon aria-hidden className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="section section-defer relative isolate border-t bg-secondary">
      {/* very subtle dot grid behind the card */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: "radial-gradient(circle, rgb(37 99 235 / 0.22) 1.2px, transparent 1.6px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="container-fluid stack [--stack-gap:var(--space-l)]">
        <SectionHeading
          id="cta-intro"
          title="Park close. Fly easy."
          description="Book your space now and ride the free shuttle straight to departures."
        />
        <div className="relative isolate grid overflow-hidden rounded-card bg-[#0a0a0a] text-primary-foreground ring-1 ring-white/10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* soft blue dot grid: fades to plain black at the left and right edges, gently visible in the middle */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,transparent,black_50%,transparent)]"
            style={{
              backgroundImage: "radial-gradient(circle, rgb(86 140 255 / 0.3) 1.7px, transparent 2.3px)",
              backgroundSize: "22px 22px",
            }}
          />

          {/* ticket: copy */}
          <div className="stack justify-center p-l lg:p-xl [--stack-gap:var(--space-s)]">
            <p className="inline-flex items-center gap-2 text-sm text-white/60">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Shuttle running now · Fiumicino FCO
            </p>
            <h2 id="cta-title" className="text-h1 font-bold text-balance">
              {FINAL_CTA.title.split(/(\d+)/).map((part, i) =>
                /^\d+$/.test(part) ? (
                  <span key={i} className="text-[#93b4ff] tabular">
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </h2>
            <p className="max-w-[40ch] text-white/60">{FINAL_CTA.body}</p>
            <dl className="mt-2xs grid max-w-[30rem] grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.02]">
              {[
                { k: "24/7", v: "Always open" },
                { k: "Free", v: "Shuttle" },
                { k: "6 min", v: "To terminal" },
              ].map(({ k, v }) => (
                <div key={v} className="px-s py-xs">
                  <dt className="text-fine text-white/50">{v}</dt>
                  <dd className="text-h3 font-semibold text-white tabular">{k}</dd>
                </div>
              ))}
            </dl>
            <div className="cluster pt-xs">
              <Button
                size="lg"
                className="group h-12 rounded-xl bg-primary px-l text-primary-foreground hover:bg-primary-hover"
                nativeButton={false}
                render={
                  <Link href="/booking">
                    Book parking <ArrowRightIcon aria-hidden className="transition-transform group-hover:translate-x-1" />
                  </Link>
                }
              />
            </div>
          </div>

          {/* perforated ticket edge */}
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 bottom-0 left-[53.5%] hidden w-px border-l-2 border-dashed border-white/15 lg:block"
          />
          <span aria-hidden className="pointer-events-none absolute -top-4 left-[53.5%] hidden size-8 -translate-x-1/2 rounded-full bg-secondary lg:block" />
          <span aria-hidden className="pointer-events-none absolute -bottom-4 left-[53.5%] hidden size-8 -translate-x-1/2 rounded-full bg-secondary lg:block" />

          {/* ticket: route */}
          <div className="flex items-center justify-center p-m max-lg:border-t max-lg:border-dashed max-lg:border-white/15 lg:p-l">
            <CtaRoute className="max-w-[26rem]" />
          </div>
        </div>
      </div>
    </section>
  )
}
