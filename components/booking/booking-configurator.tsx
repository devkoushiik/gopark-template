"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useId, useMemo, useState } from "react"
import {
  ArrowRightIcon,
  BusIcon,
  CalendarDaysIcon,
  CheckIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  MinusIcon,
  PlaneIcon,
  PlusIcon,
  TagIcon,
  XIcon,
} from "lucide-react"

import { ChoiceCard } from "@/components/booking/choice-card"
import { DateField } from "@/components/booking/date-field"
import { TimeField } from "@/components/booking/time-field"
import { ToggleRow } from "@/components/booking/toggle-row"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AIRPORTS } from "@/lib/constants"
import {
  addDays,
  combine,
  defaultTrip,
  formatDateTime,
  formatDuration,
  toDateValue,
} from "@/lib/datetime"
import {
  billableDays,
  eur,
  EXTRAS,
  MAX_PASSENGERS,
  PARKING_TYPES,
  quote,
  VEHICLES,
  type ParkingType,
  type PaymentMode,
  type QuoteLine,
  type VehicleType,
} from "@/lib/pricing"
import { cn } from "@/lib/utils"

const DT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

function readTrip(params: URLSearchParams) {
  const d = defaultTrip()
  const from = params.get("from") ?? ""
  const to = params.get("to") ?? ""
  return {
    fromDate: DT_RE.test(from) ? from.slice(0, 10) : d.fromDate,
    fromTime: DT_RE.test(from) ? from.slice(11) : d.fromTime,
    toDate: DT_RE.test(to) ? to.slice(0, 10) : d.toDate,
    toTime: DT_RE.test(to) ? to.slice(11) : d.toTime,
  }
}

const STAY_DAYS = { airport: 7, monthly: 30 } as const

export function BookingConfigurator() {
  const id = useId()
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [mode, setMode] = useState<"airport" | "monthly">("airport")
  const [trip, setTrip] = useState(() => readTrip(params))
  const [minDate] = useState(() => toDateValue(new Date()))
  const [vehicle, setVehicle] = useState<VehicleType>("car")
  const [parking, setParking] = useState<ParkingType>("open")
  const [wash, setWash] = useState(false)
  const [keepKeys, setKeepKeys] = useState(false)
  const [passengers, setPassengers] = useState(1)
  const [promoOpen, setPromoOpen] = useState(false)
  const [promoDraft, setPromoDraft] = useState("") // what is typed
  const [promo, setPromo] = useState("") // the applied code (goes into the checkout link)
  const [payMode, setPayMode] = useState<PaymentMode>("online")
  const [breakdownOpen, setBreakdownOpen] = useState(false)

  const from = combine(trip.fromDate, trip.fromTime)
  const to = combine(trip.toDate, trip.toTime)
  const ms = to.getTime() - from.getTime()
  const invalid = !(ms > 0)
  const days = billableDays(ms)

  const { lines, total } = useMemo(
    () => quote({ days, vehicle, parking, wash, pay: payMode }),
    [days, vehicle, parking, wash, payMode],
  )

  // Price breakdown groups. "Additional costs" are the choices the visitor can still take back with the x button.
  const baseLines = lines.filter((l) => ["base", "vehicle", "shuttle"].includes(l.key))
  const extraLines: QuoteLine[] = [
    ...lines.filter((l) => l.key === "parking" || l.key === "wash"),
    ...(keepKeys ? [{ key: "keys", label: EXTRAS.keepKeys.label, amount: 0 }] : []),
  ]
  const adjustLines = lines.filter((l) => l.key === "online")
  function removeExtra(key: string) {
    if (key === "parking") setParking("open")
    else if (key === "wash") setWash(false)
    else if (key === "keys") setKeepKeys(false)
  }

  // Keep the trip in the URL so results can be refreshed/shared (spec §4).
  useEffect(() => {
    const qs = new URLSearchParams(params)
    qs.set("airport", AIRPORTS[0].value)
    qs.set("from", `${trip.fromDate}T${trip.fromTime}`)
    qs.set("to", `${trip.toDate}T${trip.toTime}`)
    router.replace(`${pathname}?${qs}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to trip changes
  }, [trip])

  // Airport defaults to a 7-day stay, Monthly to 30 days, from the current drop-off
  function switchMode(next: "airport" | "monthly") {
    setMode(next)
    setTrip((t) => ({
      ...t,
      toDate: toDateValue(addDays(combine(t.fromDate, t.fromTime), STAY_DAYS[next])),
      toTime: t.fromTime,
    }))
  }

  function setFrom(date: string, time: string) {
    setTrip((t) => {
      const next = { ...t, fromDate: date, fromTime: time }
      if (combine(date, time) >= combine(t.toDate, t.toTime)) {
        next.toDate = toDateValue(addDays(combine(date, time), 1))
        next.toTime = time
      }
      return next
    })
  }

  // Car wash needs the keys — the two are mutually exclusive.
  function toggleWash(on: boolean) {
    setWash(on)
    if (on) setKeepKeys(false)
  }

  const checkoutHref = `/checkout?${new URLSearchParams({
    airport: AIRPORTS[0].value,
    from: `${trip.fromDate}T${trip.fromTime}`,
    to: `${trip.toDate}T${trip.toTime}`,
    vehicle,
    parking,
    wash: String(wash),
    keys: String(keepKeys),
    pax: String(passengers),
    pay: payMode,
    ...(promo ? { promo } : {}),
  })}`

  const continueLabel = payMode === "online" ? "Continue to payment" : "Continue to reserve"

  return (
    <div className="pb-section">
      {/* ---------------- Trip bar ---------------- */}
      <section aria-label="Your trip" className="relative z-10 container-fluid mt-l">
        <div className="@container rounded-card border bg-card p-s shadow-lg">
          <div role="tablist" aria-label="Booking type" className="mb-s inline-flex rounded-lg bg-secondary p-1">
            {(
              [
                { v: "airport", label: "Airport", Icon: PlaneIcon },
                { v: "monthly", label: "Monthly", Icon: CalendarDaysIcon },
              ] as const
            ).map(({ v, label, Icon }) => (
              <button
                key={v}
                role="tab"
                type="button"
                aria-selected={mode === v}
                onClick={() => switchMode(v)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2xs rounded-md px-4 text-sm font-medium transition-colors",
                  mode === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon aria-hidden className="size-4" /> {label}
              </button>
            ))}
          </div>

          {/* same trip form for both modes; only the default length differs (7 vs 30 days) */}
          {(
            <div className="grid gap-xs @3xl:grid-cols-[1.1fr_1fr_1fr_auto] @3xl:items-end">
              <div className="stack [--stack-gap:var(--space-3xs)]">
                <span className="text-fine font-medium text-muted-foreground">Airport</span>
                <p className="flex h-control items-center gap-2xs rounded-lg bg-secondary px-3 text-sm font-semibold">
                  <MapPinIcon aria-hidden className="size-4 shrink-0" />
                  <span className="truncate">{AIRPORTS[0].label}</span>
                </p>
              </div>

              <fieldset className="stack [--stack-gap:var(--space-3xs)]">
                <legend className="text-fine font-medium text-muted-foreground">Drop-off</legend>
                <div className="grid grid-cols-[1.3fr_1fr] gap-2xs">
                  {/* same custom calendar + time pickers as the home search form */}
                  <Label htmlFor={`${id}-fd`} className="sr-only">Drop-off date</Label>
                  <DateField
                    id={`${id}-fd`}
                    value={trip.fromDate}
                    min={minDate}
                    trip={{ from: trip.fromDate, to: trip.toDate }}
                    onChange={(v) => setFrom(v, trip.fromTime)}
                  />
                  <Label htmlFor={`${id}-ft`} className="sr-only">Drop-off time</Label>
                  <TimeField id={`${id}-ft`} value={trip.fromTime} onChange={(v) => setFrom(trip.fromDate, v)} />
                </div>
              </fieldset>

              <fieldset className="stack [--stack-gap:var(--space-3xs)]">
                <legend className="text-fine font-medium text-muted-foreground">Pick-up</legend>
                <div className="grid grid-cols-[1.3fr_1fr] gap-2xs">
                  <Label htmlFor={`${id}-td`} className="sr-only">Pick-up date</Label>
                  <DateField
                    id={`${id}-td`}
                    value={trip.toDate}
                    min={trip.fromDate}
                    trip={{ from: trip.fromDate, to: trip.toDate }}
                    invalid={invalid}
                    onChange={(v) => setTrip((t) => ({ ...t, toDate: v }))}
                  />
                  <Label htmlFor={`${id}-tt`} className="sr-only">Pick-up time</Label>
                  <TimeField
                    id={`${id}-tt`}
                    value={trip.toTime}
                    invalid={invalid}
                    onChange={(v) => setTrip((t) => ({ ...t, toTime: v }))}
                  />
                </div>
              </fieldset>

              <p
                aria-live="polite"
                className="flex h-control items-center justify-center gap-2xs rounded-lg bg-primary px-4 text-sm leading-none font-semibold whitespace-nowrap text-primary-foreground tabular"
              >
                <ClockIcon aria-hidden className="size-4 shrink-0" />
                <span className="[text-box:trim-both_cap_alphabetic]">{invalid ? "—" : `${days} ${days === 1 ? "day" : "days"}`}</span>
              </p>

              {invalid ? (
                <p role="alert" className="flex items-center gap-2xs text-sm text-destructive @3xl:col-span-4">
                  <CircleAlertIcon aria-hidden className="size-4" /> Pick-up must be after drop-off.
                </p>
              ) : (
                <p className="text-fine text-muted-foreground @3xl:col-span-4">
                  {formatDuration(ms)} · each started 24h counts as a day.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {(
        <div className="container-fluid mt-l grid gap-l lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
          {/* ---------------- Options ---------------- */}
          <div className="stack [--stack-gap:var(--space-l)]">
            <div className="stack [--stack-gap:var(--space-2xs)]">
              <h2 className="text-h2 font-semibold">Customise your booking</h2>
              <p className="text-muted-foreground">Choose what fits your trip. Your total updates as you go.</p>
            </div>

            <fieldset className="stack [--stack-gap:var(--space-xs)]">
              <legend className="mb-xs text-sm font-semibold">Vehicle type</legend>
              <div className="auto-grid gap-xs [--grid-min:11rem]">
                {VEHICLES.map((v) => (
                  <ChoiceCard
                    key={v.value}
                    name="vehicle"
                    value={v.value}
                    checked={vehicle === v.value}
                    onChange={(x) => setVehicle(x as VehicleType)}
                    label={v.label}
                    hint={v.hint}
                    meta={v.price ? `+ ${eur(v.price)}` : "Included"}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset className="stack [--stack-gap:var(--space-xs)]">
              <legend className="mb-xs text-sm font-semibold">Parking space</legend>
              <div className="auto-grid gap-xs [--grid-min:13rem]">
                {PARKING_TYPES.map((p) => (
                  <ChoiceCard
                    key={p.value}
                    name="parking"
                    value={p.value}
                    checked={parking === p.value}
                    onChange={(x) => setParking(x as ParkingType)}
                    label={p.label}
                    hint={p.hint}
                    meta={p.price ? `+ ${eur(p.price)}` : "Included"}
                  />
                ))}
              </div>
            </fieldset>

            <div className="stack [--stack-gap:var(--space-xs)]">
              <h3 className="text-sm font-semibold">Transfer to terminal</h3>
              <p className="flex items-center gap-s rounded-lg border bg-success-surface p-s text-sm">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-success shadow-sm">
                  <BusIcon className="size-5" />
                </span>
                <span className="flex-1">
                  <strong className="block font-semibold">Free shuttle to Terminals 1 & 3</strong>
                  <span className="text-muted-foreground">Every 15–20 min, 24/7. About 6 minutes.</span>
                </span>
                <span className="rounded-full bg-card px-2.5 py-1 text-fine font-semibold text-success">Included</span>
              </p>
            </div>

            <div className="stack [--stack-gap:0]">
              <h3 className="text-sm font-semibold">Extras</h3>
              <div className="divide-y">
                <ToggleRow
                  id={`${id}-wash`}
                  label={EXTRAS.wash.label}
                  hint={EXTRAS.wash.hint}
                  price={`+ ${eur(EXTRAS.wash.price)}`}
                  checked={wash}
                  onChange={toggleWash}
                />
                <ToggleRow
                  id={`${id}-keys`}
                  label={EXTRAS.keepKeys.label}
                  hint={EXTRAS.keepKeys.hint}
                  price="Free"
                  checked={keepKeys}
                  disabled={wash}
                  onChange={setKeepKeys}
                  note={
                    wash && (
                      <p className="mt-1 flex items-center gap-1 text-fine text-muted-foreground">
                        <InfoIcon aria-hidden className="size-3.5" /> Car wash needs your keys.
                      </p>
                    )
                  }
                />

                <div className="flex items-center justify-between gap-s py-s">
                  <div>
                    <p id={`${id}-pax`} className="font-semibold">Passengers</p>
                    <p className="text-sm text-muted-foreground">Travelling on the shuttle, including you.</p>
                  </div>
                  <div role="group" aria-labelledby={`${id}-pax`} className="flex items-center gap-2xs">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Fewer passengers"
                      disabled={passengers <= 1}
                      onClick={() => setPassengers((n) => n - 1)}
                    >
                      <MinusIcon />
                    </Button>
                    <output aria-live="polite" className="w-8 text-center text-lg font-semibold tabular">
                      {passengers}
                    </output>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="More passengers"
                      disabled={passengers >= MAX_PASSENGERS}
                      onClick={() => setPassengers((n) => n + 1)}
                    >
                      <PlusIcon />
                    </Button>
                  </div>
                </div>

                <div className="py-s">
                  {promoOpen ? (
                    <div className="stack [--stack-gap:var(--space-2xs)]">
                      <Label htmlFor={`${id}-promo`}>Promo code</Label>
                      <div className="relative">
                        <Input
                          id={`${id}-promo`}
                          value={promoDraft}
                          onChange={(e) => setPromoDraft(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key !== "Enter") return
                            e.preventDefault()
                            if (!promo && promoDraft.trim()) setPromo(promoDraft.trim())
                          }}
                          readOnly={!!promo}
                          autoCapitalize="characters"
                          spellCheck={false}
                          placeholder="Enter your code"
                          className={cn("plate pr-[5.75rem]", promo && "border-success/50 bg-success-surface/40")}
                          aria-describedby={`${id}-promo-hint`}
                        />
                        {/* Apply once there is a code; Remove once it is applied */}
                        <button
                          type="button"
                          disabled={!promo && !promoDraft.trim()}
                          onClick={() => {
                            if (promo) {
                              setPromo("")
                              setPromoDraft("")
                            } else {
                              setPromo(promoDraft.trim())
                            }
                          }}
                          className={cn(
                            "absolute top-1/2 right-1.5 h-8 w-[4.75rem] -translate-y-1/2 rounded-md text-sm font-semibold transition-[background-color,opacity,scale] active:scale-95 disabled:pointer-events-none disabled:opacity-40",
                            promo ? "text-muted-foreground ring-1 ring-border hover:bg-muted hover:text-foreground" : "bg-primary text-primary-foreground hover:bg-primary-hover",
                          )}
                        >
                          {promo ? "Remove" : "Apply"}
                        </button>
                      </div>
                      <p
                        id={`${id}-promo-hint`}
                        aria-live="polite"
                        className={cn("flex items-center gap-1 text-fine", promo ? "font-medium text-success" : "text-muted-foreground")}
                      >
                        {promo ? (
                          <>
                            <CheckIcon aria-hidden className="size-3.5" /> Code {promo} applied. It is confirmed at checkout.
                          </>
                        ) : (
                          "Your code is applied at checkout."
                        )}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPromoOpen(true)}
                      className="inline-flex min-h-11 items-center gap-2xs text-sm font-medium underline-offset-4 hover:underline"
                    >
                      <TagIcon aria-hidden className="size-4" /> Add a promo code
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ---------------- Summary (desktop sticky card / mobile sticky bar) ---------------- */}
          <aside
            aria-label="Price summary"
            className="sticky bottom-0 z-20 -mx-gutter lg:top-[calc(var(--header-h)+var(--space-s))] lg:bottom-auto lg:mx-0"
          >
            <div className="border-t bg-card shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.15)] lg:rounded-card lg:border lg:shadow-sm">
              {/* Breakdown: always visible on desktop, expandable on mobile */}
              <div
                id={`${id}-breakdown`}
                className={cn(
                  "stack px-gutter pt-s [--stack-gap:var(--space-s)] lg:block lg:px-m lg:pt-m",
                  !breakdownOpen && "hidden",
                )}
              >
                <div className="text-sm">
                  <p className="font-semibold">Rome Fiumicino · FCO</p>
                  <p className="text-muted-foreground tabular">
                    {formatDateTime(from)} → {formatDateTime(to)}
                  </p>
                </div>
                <dl className="stack text-sm [--stack-gap:var(--space-2xs)] lg:mt-s">
                  {baseLines.map((l) => (
                    <div key={l.key} className="flex justify-between gap-s">
                      <dt className="text-muted-foreground">{l.label}</dt>
                      <dd className="tabular">{l.amount ? eur(l.amount) : "Free"}</dd>
                    </div>
                  ))}
                </dl>

                {/* additional costs: each one can be taken back with its x button (the matching option above switches off) */}
                {extraLines.length > 0 && (
                  <div className="text-sm lg:mt-s">
                    <p className="mb-2xs text-fine font-semibold tracking-wider text-muted-foreground uppercase">Additional costs</p>
                    <ul className="stack [--stack-gap:var(--space-2xs)]">
                      {extraLines.map((l) => (
                        <li key={l.key} className="flex items-center justify-between gap-xs">
                          <span className="font-medium">+ {l.label}</span>
                          <span className="flex items-center gap-xs">
                            <span className="tabular font-semibold">{l.amount ? eur(l.amount) : "Free"}</span>
                            <button
                              type="button"
                              onClick={() => removeExtra(l.key)}
                              aria-label={`Remove ${l.label}`}
                              className="grid size-7 place-items-center rounded-md bg-secondary text-muted-foreground transition-[background-color,color,scale] hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-90"
                            >
                              <XIcon aria-hidden className="size-3.5" />
                            </button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {adjustLines.length > 0 && (
                  <dl className="stack text-sm [--stack-gap:var(--space-2xs)] lg:mt-s">
                    {adjustLines.map((l) => (
                      <div key={l.key} className="flex justify-between gap-s">
                        <dt className="text-muted-foreground">{l.label}</dt>
                        <dd className="tabular text-success">{eur(l.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                <fieldset className="lg:mt-s">
                  <legend className="sr-only">How to pay</legend>
                  <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
                    {(
                      [
                        { v: "online", label: "Pay online" },
                        { v: "lot", label: "Pay at the lot" },
                      ] as const
                    ).map(({ v, label }) => (
                      <label
                        key={v}
                        className="flex min-h-10 cursor-pointer items-center justify-center rounded-md text-sm font-medium text-muted-foreground transition-colors has-checked:bg-card has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
                      >
                        <input
                          type="radio"
                          name="pay"
                          value={v}
                          checked={payMode === v}
                          onChange={() => setPayMode(v)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="safe-bottom flex items-center gap-s px-gutter pt-s lg:mt-s lg:flex-col lg:items-stretch lg:border-t lg:px-m lg:pb-m">
                <button
                  type="button"
                  onClick={() => setBreakdownOpen((o) => !o)}
                  aria-expanded={breakdownOpen}
                  aria-controls={`${id}-breakdown`}
                  className="flex flex-1 items-center gap-2xs text-left lg:pointer-events-none"
                >
                  <span>
                    <span className="block text-fine text-muted-foreground">
                      Total · {days} {days === 1 ? "day" : "days"}
                    </span>
                    <span className="block text-h2 font-bold tabular" aria-live="polite">{eur(total)}</span>
                  </span>
                  <ChevronUpIcon
                    aria-hidden
                    className={cn("size-4 transition-transform lg:hidden", !breakdownOpen && "rotate-180")}
                  />
                  <span className="sr-only lg:hidden">{breakdownOpen ? "Hide" : "Show"} price breakdown</span>
                </button>
                <Button
                  size="lg"
                  disabled={invalid}
                  className="lg:w-full"
                  nativeButton={false}
                  render={
                    <Link href={invalid ? "#" : checkoutHref} aria-disabled={invalid || undefined}>
                      <span className="hidden sm:inline">{continueLabel}</span>
                      <span className="sm:hidden">Continue</span>
                      <ArrowRightIcon aria-hidden />
                    </Link>
                  }
                />
                <p className="hidden text-center text-fine text-muted-foreground lg:block">
                  Total includes all mandatory fees. Cancel within 24h for a €1.99 fee.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
