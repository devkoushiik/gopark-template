"use client"

import { useEffect, useId, useRef, useState } from "react"
import { CircleAlertIcon, MoonIcon, CarFrontIcon, PlaneLandingIcon, PlaneTakeoffIcon } from "lucide-react"

import { DateField } from "@/components/booking/date-field"
import { ValidationStamp } from "@/components/booking/validation-stamp"
import { SplitButton } from "@/components/ui/split-button"
import { TimeField } from "@/components/booking/time-field"
import { Label } from "@/components/ui/label"
import { AIRPORTS } from "@/lib/constants"
import { addDays, combine, isSmallHours, toDateValue } from "@/lib/datetime"
import { cn } from "@/lib/utils"

export const selectClass =
  "h-control w-full min-w-0 appearance-none rounded-lg border border-input bg-card bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><path d=%22M4 6l4 4 4-4%22 fill=%22none%22 stroke=%22%23737373%22 stroke-width=%221.5%22/></svg>')] bg-[length:1rem] bg-[position:right_0.75rem_center] bg-no-repeat pl-3 pr-9 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"


function splitDuration(ms: number) {
  const totalHours = Math.round(ms / 36e5)
  return { days: Math.floor(totalHours / 24), hours: totalHours % 24 }
}

const nightLabel = (date: string) => {
  const d = combine(date, "00:00")
  const prev = addDays(d, -1).toLocaleDateString("en-GB", { weekday: "long" })
  const day = d.toLocaleDateString("en-GB", { weekday: "long" })
  return `the night of ${prev} into ${day}`
}

type StopProps = {
  id: string
  label: string
  tip: string
  date: string
  time: string
  minDate: string
  trip: { from: string; to: string }
  invalid?: boolean
  describedBy?: string
  onDate: (v: string) => void
  onTime: (v: string) => void
}

/** One stop on the trip timeline: date + time pair with a tip. */
function Stop({ id, label, tip, date, time, minDate, trip, invalid, describedBy, onDate, onTime }: StopProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2xs text-sm font-semibold">{label}</legend>
      <div className="grid grid-cols-[1.25fr_1fr] gap-2xs">
        <Label htmlFor={`${id}-d`} className="sr-only">{label} date</Label>
        <DateField
          id={`${id}-d`}
          value={date}
          min={minDate}
          trip={trip}
          invalid={invalid}
          describedBy={describedBy}
          onChange={onDate}
        />
        <Label htmlFor={`${id}-t`} className="sr-only">{label} time</Label>
        <TimeField id={`${id}-t`} value={time} invalid={invalid} onChange={onTime} />
      </div>
      <p className="mt-2xs text-fine text-muted-foreground">{tip}</p>
    </fieldset>
  )
}

/**
 * Hero booking card styled as a vertical parking pass:
 * airport header, drop-off → pick-up timeline with the live duration on the
 * rail, and a perforated tear-off stub holding the submit.
 */
export function BookingSearchForm({ className }: { className?: string }) {
  const id = useId()
  const airport = AIRPORTS[0]

  // Smart defaults (spec §4): tomorrow 09:00 → +3 days 13:00.
  const [defaults] = useState(() => {
    const today = new Date()
    return {
      min: toDateValue(today),
      fromDate: toDateValue(addDays(today, 1)),
      toDate: toDateValue(addDays(today, 4)),
    }
  })

  const [fromDate, setFromDate] = useState(defaults.fromDate)
  const [fromTime, setFromTime] = useState("09:00")
  const [toDate, setToDate] = useState(defaults.toDate)
  const [toTime, setToTime] = useState("13:00")

  const durationMs = combine(toDate, toTime).getTime() - combine(fromDate, fromTime).getTime()
  const invalidRange = !(durationMs > 0)
  const { days, hours } = splitDuration(Math.max(0, durationMs))

  // Keep pick-up after drop-off: shift it forward if drop-off moves past it.
  function updateFrom(nextDate: string, nextTime: string) {
    setFromDate(nextDate)
    setFromTime(nextTime)
    if (combine(nextDate, nextTime) >= combine(toDate, toTime)) {
      setToDate(toDateValue(addDays(combine(nextDate, nextTime), 1)))
      setToTime(nextTime)
    }
  }

  // Tear choreography along the perforation:
  // rest -> opening (cut to halfway on load) -> half (parked) -> cutting (finish on submit) -> falling.
  // Reduced motion: parks at half instantly and submits immediately.
  const formRef = useRef<HTMLFormElement>(null)
  type Phase = "rest" | "opening" | "half" | "cutting" | "falling"
  const [phase, setPhase] = useState<Phase>("rest")

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setPhase("half")
      return
    }
    const t1 = window.setTimeout(() => setPhase("opening"), 1000)
    const t2 = window.setTimeout(() => setPhase((p) => (p === "opening" ? "half" : p)), 1900)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [])

  // Hovering / focusing the button finishes the cut as a preview; leaving backs it up.
  const [aiming, setAiming] = useState(false)
  const [settling, setSettling] = useState(false)
  const settleTimer = useRef<number | undefined>(undefined)
  function aim(on: boolean) {
    if (phase !== "half") return
    setAiming(on)
    setSettling(true)
    window.clearTimeout(settleTimer.current)
    settleTimer.current = window.setTimeout(() => setSettling(false), on ? 650 : 900)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (invalidRange) return e.preventDefault()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    e.preventDefault()
    // Already fully cut by hover: drop the stub straight away.
    const cutDone = aiming && !settling
    setPhase(cutDone ? "falling" : "cutting")
    if (!cutDone) window.setTimeout(() => setPhase("falling"), 650)
    window.setTimeout(() => formRef.current?.submit(), cutDone ? 550 : 1200)
  }

  const busy = phase === "cutting" || phase === "falling"
  const reach = phase === "rest" ? "rest" : busy || (phase === "half" && aiming) ? "full" : "half"

  // Dashed track; turns red when the range is invalid.
  const rail = invalidRange
    ? "bg-[repeating-linear-gradient(180deg,var(--destructive)_0_6px,transparent_6px_10px)]"
    : "bg-[repeating-linear-gradient(180deg,var(--primary)_0_6px,transparent_6px_10px)]"
  const node = cn(
    "grid size-7 shrink-0 place-items-center rounded-full ring-4 ring-card motion-safe:animate-node-pop",
    invalidRange ? "bg-destructive text-white" : "bg-primary text-primary-foreground",
  )

  return (
    <form
      action="/booking"
      method="get"
      noValidate
      ref={formRef}
      onSubmit={onSubmit}
      aria-labelledby={`${id}-title`}
      className={cn("relative text-card-foreground", className)}
    >
      <input type="hidden" name="airport" value={airport.value} />
      <input type="hidden" name="from" value={`${fromDate}T${fromTime}`} />
      <input type="hidden" name="to" value={`${toDate}T${toTime}`} />

      {/* Push-pin the pass hangs from; the card swings around this point on load */}
      <span aria-hidden className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
        <span className="block size-5 rounded-full bg-[radial-gradient(circle_at_35%_30%,#8fb4ff_0%,var(--primary)_45%,#173fa8_100%)] shadow-[0_3px_6px_rgb(11_15_25/0.55),inset_0_-1px_1px_rgb(0_0_0/0.25)] motion-safe:animate-pin-drop" />
      </span>

      {/* drop-shadow (not box-shadow) so it follows the notched mask */}
      <div className="group/pass relative origin-[50%_0.25rem] drop-shadow-[0_30px_50px_rgb(11_15_25/0.45)] motion-safe:animate-card-swing">
        <div className="pass-body overflow-hidden rounded-t-card bg-card">
          {/* ---------- Header: destination ---------- */}
          <div
            className={cn(
              "relative bg-secondary px-m pt-m pb-[calc(var(--space-m)+7px)] text-foreground",
              // security-paper pattern: crossed hairlines + soft light falloff
              "bg-[repeating-linear-gradient(135deg,rgb(11_15_25/0.045)_0_1px,transparent_1px_7px),repeating-linear-gradient(45deg,rgb(37_99_235/0.035)_0_1px,transparent_1px_11px),radial-gradient(120%_90%_at_0%_0%,#ffffff_0%,transparent_60%)]",
            )}
          >
            {/* stamp lands across the pinked edge: ~2/3 on the header, ~1/3 on the body */}
            <ValidationStamp className="absolute right-5 -bottom-6 z-10 size-[5.5rem] -rotate-[14deg] opacity-85 motion-safe:animate-stamp" />
            <h2 id={`${id}-title`} className="text-sm font-medium text-muted-foreground">
              Find airport parking
            </h2>
            <div className="mt-2xs flex items-end gap-s">
              <span className="text-[2.75rem] leading-none font-bold tracking-tight">FCO</span>
              <span className="pb-1 text-sm leading-tight">
                Rome Fiumicino
                <span className="block text-muted-foreground">Terminals 1 & 3</span>
              </span>
            </div>
            {/* pinked edge: white teeth bite up into the header, separating it from the body */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[7px] bg-card [mask:conic-gradient(from_135deg_at_top,#0000,#000_1deg_89deg,#0000_90deg)_50%/14px_100%]"
            />
          </div>

          {/* ---------- Trip timeline ---------- */}
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-s px-m pt-m pb-s">
            {/* drop-off: you fly out */}
            <div className="flex flex-col items-center" aria-hidden>
              <span className={node}>
                <PlaneTakeoffIcon className="size-3.5" />
              </span>
              <span className={cn("w-0.5 flex-1 origin-top motion-safe:animate-rail-draw", rail)} />
            </div>
            <Stop
              id={`${id}-from`}
              label="Drop-off"
              tip="Arrive 2-3 hours before your flight."
              date={fromDate}
              time={fromTime}
              minDate={defaults.min}
              trip={{ from: fromDate, to: toDate }}
              onDate={(v) => updateFrom(v, fromTime)}
              onTime={(v) => updateFrom(fromDate, v)}
            />

            {/* rail with the parked car waiting for the stay */}
            <div className="relative flex justify-center" aria-hidden>
              <span className={cn("w-0.5 origin-top motion-safe:animate-rail-draw", rail)} />
              <span className="absolute top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-brand-soft text-brand-soft-foreground ring-4 ring-card motion-safe:animate-node-pop motion-safe:[animation-delay:1.2s]">
                <CarFrontIcon className="size-3.5" />
              </span>
            </div>
            <div aria-live="polite" className="py-s">
              {invalidRange ? (
                <p id={`${id}-err`} className="inline-flex items-center gap-2xs rounded-full bg-destructive-surface px-3 py-1 text-sm font-medium text-destructive">
                  <CircleAlertIcon aria-hidden className="size-4" />
                  Pick-up must be after drop-off
                </p>
              ) : (
                <p className="inline-flex items-baseline gap-1 rounded-full bg-brand-soft px-3 py-1 text-brand-soft-foreground tabular">
                  <span className="text-lg font-bold">{days}</span>
                  <span className="text-sm font-medium">{days === 1 ? "day" : "days"}</span>
                  {hours > 0 && (
                    <>
                      <span className="ml-1 text-lg font-bold">{hours}</span>
                      <span className="text-sm font-medium">{hours === 1 ? "hour" : "hours"}</span>
                    </>
                  )}
                  <span className="sr-only">of parking</span>
                </p>
              )}
              {!invalidRange && isSmallHours(fromTime) && (
                <p className="mt-2xs flex items-center gap-2xs text-sm">
                  <MoonIcon aria-hidden className="size-4 shrink-0 text-warning" />
                  Drop-off is {nightLabel(fromDate)}.
                </p>
              )}
            </div>

            {/* pick-up: you land and collect the car */}
            <div className="flex flex-col items-center" aria-hidden>
              <span className={cn("h-1 w-0.5 origin-top motion-safe:animate-rail-draw", rail)} />
              <span className={cn(node, "motion-safe:[animation-delay:1.5s]")}>
                <PlaneLandingIcon className="size-3.5" />
              </span>
            </div>
            <Stop
              id={`${id}-to`}
              label="Pick-up"
              tip="Allow 45-60 min after landing for baggage."
              date={toDate}
              time={toTime}
              minDate={fromDate}
              trip={{ from: fromDate, to: toDate }}
              invalid={invalidRange}
              describedBy={invalidRange ? `${id}-err` : undefined}
              onDate={setToDate}
              onTime={setToTime}
            />
          </div>

        </div>

        {/* ---------- Stub: separate piece so it can be cut off along the perforation ---------- */}
        <div
          className={cn(
            "pass-stub relative flex h-34 flex-col justify-center gap-xs rounded-b-card bg-secondary px-m",
            "origin-top-left transition-[translate,rotate,opacity]",
            phase === "falling"
              ? "translate-y-[140%] rotate-[7deg] opacity-0 duration-500 ease-[cubic-bezier(0.55,0,1,0.45)]"
              : "duration-300",
          )}
        >
          {/* perforation */}
          <span aria-hidden className="absolute inset-x-[var(--notch)] top-0 border-t-2 border-dashed border-input" />
          <SplitButton
            type="submit"
            disabled={invalidRange || busy}
            onPointerEnter={() => aim(true)}
            onPointerLeave={() => aim(false)}
            onFocus={() => aim(true)}
            onBlur={() => aim(false)}
          >
            Find parking
          </SplitButton>
          <p className="text-center text-fine text-muted-foreground">Free shuttle included. Cancel within 24h.</p>
        </div>
      </div>
    </form>
  )
}
