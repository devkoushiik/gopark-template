"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRightIcon,
  BusIcon,
  BadgeEuroIcon,
  CalendarDaysIcon,
  ClockIcon,
  TicketIcon,
  TimerIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { eur } from "@/lib/pricing"
import { cn } from "@/lib/utils"
import { DotPattern } from "@/components/layout/dot-pattern"

// TODO: replace with the booking returned by the API for the plate entered
const DEMO = {
  ref: "GP-7K3Q-21",
  plate: "AB123CD",
  vehicle: "Fiat Panda",
  passengers: 1,
  space: "Open-air",
  name: "Giulia Ferri",
  phone: "+39 333 123 4567",
  email: "giulia@example.com",
  entry: "Mon 27 Oct, 18:00",
  exit: "Sun 2 Nov, 18:00",
  arrived: "Mon 27 Oct, 17:52",
  total: 31,
  paid: 31,
}

// facts already stated on the site
const SHUTTLE_FACTS = [
  { Icon: TimerIcon, label: "6 min to T1 & T3" },
  { Icon: ClockIcon, label: "Every 15-20 min" },
  { Icon: BadgeEuroIcon, label: "Included in your booking" },
]

const STATUS = ["Request sent", "Driver assigned", "On the way"] as const

/** One stat: small uppercase label over its value. */
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-[0.72rem] font-medium tracking-wider text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-lg leading-snug font-semibold break-words">{children}</dd>
    </div>
  )
}

/** A white card for a group of stats: round icon badge + title, a dashed rule, then the stats. */
function Panel({
  icon: Icon,
  title,
  lead,
  children,
}: {
  icon: typeof TicketIcon
  title: string
  /** Optional element beside the stats (e.g. an avatar). */
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border bg-card p-s shadow-[0_1px_0_rgb(11_15_25/0.03),0_12px_24px_-18px_rgb(11_15_25/0.35)]">
      <h3 className="flex items-center gap-xs text-sm font-bold tracking-wider text-foreground uppercase">
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-brand-soft text-primary">
          <Icon className="size-4" />
        </span>
        {title}
      </h3>
      <div className="mt-xs flex items-start gap-s border-t border-dashed pt-xs">
        {lead}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

type Phase = "lookup" | "ready" | "calling" | "coming"

/** `plate` comes from the /PLATE short link: skip the lookup and show that car's shuttle state. */
export function CallShuttle({ plate }: { plate?: string } = {}) {
  const [phase, setPhase] = useState<Phase>(plate ? "ready" : "lookup")
  const [step, setStep] = useState(0)
  // TODO: load the booking for `plate` from the API (and its live shuttle state)
  const b = plate ? { ...DEMO, plate } : DEMO
  const due = b.total - b.paid

  // pending status steps, so cancelling (or leaving the page) stops them
  const timers = useRef<number[]>([])
  useEffect(() => {
    const t = timers.current
    return () => t.forEach(clearTimeout)
  }, [])

  const call = () => {
    timers.current.forEach(clearTimeout)
    setPhase("calling")
    // TODO: POST the shuttle request; advance status from the dispatch API
    timers.current = [
      window.setTimeout(() => {
        setPhase("coming")
        setStep(1)
        timers.current.push(window.setTimeout(() => setStep(2), 1800))
      }, 900),
    ]
  }

  const cancel = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    // TODO: cancel the shuttle request with the dispatch API
    setPhase("ready")
    setStep(0)
  }

  return (
    <>
      {/* same look as the contact and booking heroes; the card sits below it */}
      <section aria-labelledby="shuttle-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        <div aria-hidden className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />
        <div className="container-fluid stack py-xl [--stack-gap:var(--space-s)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md">
            <BusIcon aria-hidden className="size-4" />
            Free shuttle, 24/7
          </p>
          <h1 id="shuttle-title" className="max-w-[14ch] text-hero font-bold">Call the shuttle.</h1>
          <p className="max-w-[48ch] text-lg text-white/80">Back from your trip? We pick you up at the terminal and drive you to your car.</p>
          <ul className="mt-2xs flex flex-wrap gap-2xs">
            {SHUTTLE_FACTS.map(({ Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/85 ring-1 ring-white/15 backdrop-blur-md">
                <Icon aria-hidden className="size-4 text-[#93b4ff]" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="container-fluid relative z-10 mt-l pb-section">
        {phase === "lookup" ? (
          <form
            className="mx-auto max-w-[32rem] rounded-card border bg-card p-m shadow-lg"
            onSubmit={(e) => {
              e.preventDefault()
              // TODO: look the booking up via the API
              setPhase("ready")
            }}
          >
            <h2 className="font-semibold">Find your booking</h2>
            <p className="text-sm text-muted-foreground">Enter the license plate of the car you parked with us.</p>
            <div className="stack mt-m [--stack-gap:var(--space-3xs)]">
              <Label htmlFor="sh-plate">License plate</Label>
              <Input id="sh-plate" required autoCapitalize="characters" spellCheck={false} placeholder="e.g. AB123CD" className="h-12 plate uppercase" />
            </div>
            <button type="submit" className="mt-m inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary-hover">
              Find booking <ArrowRightIcon aria-hidden className="size-4" />
            </button>
          </form>
        ) : (
          <div className="mx-auto max-w-[40rem] overflow-hidden rounded-card border bg-card shadow-lg">
            {/* shuttle photo */}
            <div className="relative aspect-[16/9] bg-secondary">
              <Image
                src="/images/shuttle.webp"
                alt="The GoPark shuttle, a silver minivan"
                fill
                priority
                sizes="(min-width: 640px) 40rem, 100vw"
                className="object-cover"
              />
              <span aria-live="polite" className="absolute top-s left-s inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-sm">
                <span className={cn("size-2 rounded-full", phase === "coming" ? "animate-pulse bg-success" : "bg-muted-foreground/50")} />
                {phase === "coming" ? STATUS[step] : "Ready when you are"}
              </span>
            </div>

            <div className="stack p-m [--stack-gap:var(--space-m)]">
              <div className="stack [--stack-gap:var(--space-xs)]">
                <Panel icon={TicketIcon} title="Booking">
                  <dl className="grid grid-cols-2 gap-x-s gap-y-s">
                    <Field label="Booking ID">
                      <span className="plate tracking-wide text-primary">{b.ref}</span>
                    </Field>
                    <Field label="Car plate">
                      {/* plate-style chip */}
                      <span className="plate inline-block rounded-md border-2 border-foreground/80 bg-white px-2 py-0.5 text-base tracking-widest shadow-sm">{b.plate}</span>
                    </Field>
                    <Field label="Passengers">{b.passengers}</Field>
                    <Field label="Parking type">{b.space}</Field>
                  </dl>
                </Panel>

                <Panel
                  icon={UserIcon}
                  title="Customer"
                  lead={
                    <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-base font-semibold text-primary-foreground shadow-[inset_0_-3px_0_rgb(0_0_0/0.15)]">
                      {initials(b.name)}
                    </span>
                  }
                >
                  <dl className="grid grid-cols-1 gap-x-s gap-y-s sm:grid-cols-2">
                    <Field label="Name">{b.name}</Field>
                    <Field label="Phone">{b.phone}</Field>
                    <Field label="Email" className="sm:col-span-2">
                      {b.email}
                    </Field>
                  </dl>
                </Panel>

                <Panel icon={CalendarDaysIcon} title="Schedule">
                  {/* vertical timeline: dot per step, a rail between them; the last step (arrived) is green */}
                  <dl className="stack [--stack-gap:var(--space-s)]">
                    {(
                      [
                        ["Entry", b.entry, false],
                        ["Exit", b.exit, false],
                        ["Arrived", b.arrived, true],
                      ] as const
                    ).map(([label, value, done], i) => (
                      <div key={label} className="relative pl-m">
                        {i < 2 && <span aria-hidden className="absolute top-3 -bottom-3 left-[0.3125rem] w-px bg-border" />}
                        <span
                          aria-hidden
                          className={cn("absolute top-1 left-0 size-3 rounded-full ring-4", done ? "bg-success ring-success-surface" : "bg-primary ring-brand-soft")}
                        />
                        <dt className="text-[0.72rem] font-medium tracking-wider text-muted-foreground uppercase">{label}</dt>
                        <dd className="mt-1 text-lg leading-snug font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>

                {/* receipt strip */}
                <section className="rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,var(--brand-soft),var(--card))] p-s">
                  <dl className="grid grid-cols-3 items-end gap-x-s">
                    <Field label="Total">{eur(b.total)}</Field>
                    <Field label="Paid">{eur(b.paid)}</Field>
                    <Field label="Due">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-0.5 font-bold tabular",
                          due > 0 ? "bg-destructive/10 text-destructive" : "bg-success-surface text-success",
                        )}
                      >
                        {eur(due)}
                      </span>
                    </Field>
                  </dl>
                </section>
              </div>

              <button
                type="button"
                onClick={call}
                disabled={phase !== "ready"}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground transition-[background-color,opacity,scale] hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60"
              >
                <BusIcon aria-hidden className="size-5" />
                {phase === "ready" ? "Call Shuttle" : phase === "calling" ? "Calling…" : "Shuttle requested"}
              </button>
              {/* shows once the shuttle has been called, and puts the screen back to "ready" */}
              {phase !== "ready" && (
                <button
                  type="button"
                  onClick={cancel}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-destructive/30 font-semibold text-destructive transition-[background-color,scale] hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-destructive active:scale-[0.98] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-300"
                >
                  <XIcon aria-hidden className="size-4" />
                  Cancel Shuttle
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
