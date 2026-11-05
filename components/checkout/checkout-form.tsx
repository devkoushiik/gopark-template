"use client"

import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useId, useMemo, useRef, useState } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  BriefcaseIcon,
  CarIcon,
  CheckCircle2Icon,
  CheckIcon,
  CirclePlusIcon,
  ConciergeBellIcon,
  KeyRoundIcon,
  LockIcon,
  MapPinIcon,
  PlaneIcon,
  ShieldCheckIcon,
  SquareParkingIcon,
  UserRoundIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"

import { DemoPayment } from "@/components/checkout/demo-payment"
import { DialCodeSelect } from "@/components/checkout/dial-code-select"
import { SelectField } from "@/components/ui/select-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CONTACT } from "@/lib/constants"
import { combine, defaultTrip, formatDateTime } from "@/lib/datetime"
import {
  billableDays,
  eur,
  EXTRAS,
  PARKING_TYPES,
  quote,
  VEHICLES,
  type ParkingType,
  type PaymentMode,
  type VehicleType,
} from "@/lib/pricing"
import { cn } from "@/lib/utils"

const DT_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/

// Facility facts, kept to what the site states elsewhere (verify before launch).
const FACILITY: { title: string; Icon: LucideIcon; items: string[] }[] = [
  { title: "Safety", Icon: ShieldCheckIcon, items: ["CCTV surveillance", "Staff on site 24/7", "Secure, fenced parking"] },
  { title: "Services", Icon: ConciergeBellIcon, items: ["Free shuttle to T1 & T3", "24/7 customer support", "Car valet", "Car wash"] },
  { title: "Parking", Icon: SquareParkingIcon, items: ["Open-air and covered spaces", "Large vehicles and buses welcome"] },
  { title: "Extras", Icon: KeyRoundIcon, items: ["Keep your keys with you, free"] },
]

const STEPS = ["Trip", "Your details", "Payment"]
const CURRENT_STEP = 1

/** Small switch used for the optional sections. */
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-2 text-sm font-medium">
      <span className="sr-only sm:not-sr-only">{label}</span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-10 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  )
}

const GALLERY = [
  { src: "/images/fco-1.webp", alt: "Food court under the glass roof at Rome Fiumicino Airport" },
  { src: "/images/fco-2.webp", alt: "Leonardo Express train at the Fiumicino Airport rail station" },
  { src: "/images/fco-3.webp", alt: "Departures hall with seating under the skylight at Fiumicino" },
]

function readParams(p: URLSearchParams) {
  const d = defaultTrip()
  const from = p.get("from") ?? ""
  const to = p.get("to") ?? ""
  const pick = <T extends string>(v: string | null, allowed: readonly T[], fallback: T) =>
    allowed.includes(v as T) ? (v as T) : fallback
  return {
    from: DT_RE.test(from) ? combine(from.slice(0, 10), from.slice(11)) : combine(d.fromDate, d.fromTime),
    to: DT_RE.test(to) ? combine(to.slice(0, 10), to.slice(11)) : combine(d.toDate, d.toTime),
    vehicle: pick<VehicleType>(p.get("vehicle"), ["car", "long", "bus"], "car"),
    parking: pick<ParkingType>(p.get("parking"), ["open", "covered"], "open"),
    wash: p.get("wash") === "true",
    keys: p.get("keys") === "true",
    pax: Math.max(1, Number(p.get("pax")) || 1),
    pay: pick<PaymentMode>(p.get("pay"), ["online", "lot"], "online"),
    promo: p.get("promo") ?? "",
  }
}

/** Form card: icon tile + title + one-line hint, then content. */
function Section({
  Icon,
  title,
  hint,
  aside,
  children,
}: {
  Icon: LucideIcon
  title: string
  hint?: string
  aside?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="rounded-card border bg-card p-m">
      <div className="flex items-start justify-between gap-s">
        <div className="flex items-center gap-s">
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-primary">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">{title}</h2>
            {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
          </div>
        </div>
        {aside}
      </div>
      {children && <div className="mt-m">{children}</div>}
    </section>
  )
}

/** Label above the input (never beside it, never placeholder-as-label). */
function Field({ label, optional, htmlFor, wide, children }: { label: string; optional?: boolean; htmlFor: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("stack [--stack-gap:var(--space-3xs)]", wide && "sm:col-span-2")}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
      </Label>
      {children}
    </div>
  )
}

const field = "h-12"

type Car = { id: number; model: string; plate: string; colour: string; year: string; fuel: string; country: string; notes: string }
const newCar = (id: number): Car => ({ id, model: "", plate: "", colour: "", year: "", fuel: "", country: "", notes: "" })
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG / CNG", "Other"]
const NATIONS = ["Italy", "Austria", "Belgium", "France", "Germany", "Netherlands", "Spain", "Switzerland", "United Kingdom", "United States", "Other"]
const grid = "grid gap-s sm:grid-cols-2"

export function CheckoutForm() {
  const id = useId()
  const params = useSearchParams()
  const t = useMemo(() => readParams(new URLSearchParams(params)), [params])
  const days = billableDays(t.to.getTime() - t.from.getTime())
  const { lines, total } = useMemo(
    () => quote({ days, vehicle: t.vehicle, parking: t.parking, wash: t.wash, pay: t.pay }),
    [days, t.vehicle, t.parking, t.wash, t.pay],
  )
  const vehicleLabel = VEHICLES.find((v) => v.value === t.vehicle)!.label
  const parkingLabel = PARKING_TYPES.find((p) => p.value === t.parking)!.label

  const [business, setBusiness] = useState(false)
  const [flights, setFlights] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [state, setState] = useState<"idle" | "pending" | "payment" | "done">("idle")

  // vehicles: pick which one is being parked, add another with the + button
  const [cars, setCars] = useState<Car[]>([newCar(1)])
  const [carId, setCarId] = useState(1)
  const nextCarId = useRef(2)
  const [vehicleOpen, setVehicleOpen] = useState(false) // the + button expands the details of the selected vehicle
  const car = cars.find((c) => c.id === carId) ?? cars[0]
  const patchCar = (patch: Partial<Car>) => setCars((cs) => cs.map((c) => (c.id === car.id ? { ...c, ...patch } : c)))
  function addCar() {
    const id = nextCarId.current++
    setCars((cs) => [...cs, newCar(id)])
    setCarId(id)
    setVehicleOpen(true)
  }
  function removeCar(id: number) {
    const rest = cars.filter((c) => c.id !== id)
    setCars(rest)
    if (carId === id) setCarId(rest[0].id)
  }
  const backHref = `/booking?${new URLSearchParams({ from: params.get("from") ?? "", to: params.get("to") ?? "" })}`
  const mapsQuery = encodeURIComponent(CONTACT.address.join(", "))

  if (state === "payment") {
    return <DemoPayment total={total} onBack={() => setState("idle")} onPaid={() => setState("done")} />
  }

  if (state === "done") {
    return (
      <div className="bg-secondary py-section">
        <div role="status" className="container-fluid mx-auto stack max-w-[34rem] items-center rounded-card border bg-card p-l text-center shadow-sm [--stack-gap:var(--space-s)]">
          <CheckCircle2Icon aria-hidden className="size-12 text-success" />
          <h1 className="text-h2 font-bold">{t.pay === "online" ? "Payment successful" : "Your space is reserved"}</h1>
          <p className="text-muted-foreground">
            {t.pay === "online"
              ? "Your space is reserved. We've emailed your booking summary."
              : "We've emailed your booking summary. Pay at the car park when you arrive."}
          </p>
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* dark top band, like the booking page, so the page doesn't blend into the white header */}
      <section aria-labelledby="checkout-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <div className="container-fluid stack pt-l pb-[calc(var(--space-xl)+var(--space-l))] [--stack-gap:var(--space-s)]">
          <Link
            href={backHref}
            className="group inline-flex min-h-10 w-fit items-center gap-2 rounded-full bg-white/10 py-1 pr-4 pl-1 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur-md transition-colors outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowLeftIcon aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" />
            </span>
            Back to booking
          </Link>
          <h1 id="checkout-title" className="text-h1 font-bold">Complete your booking.</h1>
          {/* progress: trip done, details now, payment next */}
          <ol className="mt-xs flex items-center gap-xs text-sm">
            {STEPS.map((step, i) => {
              const done = i < CURRENT_STEP
              const current = i === CURRENT_STEP
              return (
                <li key={step} className="flex items-center gap-xs" aria-current={current ? "step" : undefined}>
                  <span
                    aria-hidden
                    className={cn(
                      "tabular grid size-8 shrink-0 place-items-center rounded-full font-semibold",
                      done && "bg-primary text-primary-foreground",
                      current && "bg-white text-ink ring-4 ring-white/15",
                      !done && !current && "text-white/50 ring-1 ring-white/25",
                    )}
                  >
                    {done ? <CheckIcon className="size-4" strokeWidth={3} /> : i + 1}
                  </span>
                  {/* labels stay visible for the current step; others collapse on small screens */}
                  <span className={cn("font-medium", done && "text-white/80", current && "text-white", !done && !current && "text-white/50", !current && "max-sm:sr-only")}>
                    {step}
                  </span>
                  {i < STEPS.length - 1 && <span aria-hidden className={cn("ml-xs h-px w-6 sm:w-12", done ? "bg-primary" : "bg-white/20")} />}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

    <div className="container-fluid relative z-10 -mt-[calc(var(--space-xl)+var(--space-s))] pb-section">
      <div className="grid gap-l lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
        <form
          className="stack [--stack-gap:var(--space-s)]"
          onSubmit={(e) => {
            e.preventDefault()
            if (!car.model.trim() || !car.plate.trim()) {
              setVehicleOpen(true)
              const missing = !car.model.trim() ? "vm" : "vp"
              window.requestAnimationFrame(() => document.getElementById(`${id}-${missing}`)?.focus())
              return
            }
            if (!accepted) return
            setState("pending")
            // TODO: create the booking via the API, then redirect to the payment provider (online)
            // paying online goes through the (demo) payment page first; paying at the lot is reserved straight away
            window.setTimeout(() => setState(t.pay === "online" ? "payment" : "done"), 800)
          }}
        >
          <Section
            Icon={CarIcon}
            title="Your vehicle"
            hint="So our team can find your car on return."
            aside={
              <button
                type="button"
                onClick={() => setVehicleOpen((o) => !o)}
                aria-expanded={vehicleOpen}
                aria-controls={`${id}-vehicle-details`}
                aria-label={vehicleOpen ? "Hide vehicle details" : "Add vehicle details"}
                title={vehicleOpen ? "Hide vehicle details" : "Add vehicle details"}
                className="grid size-9 shrink-0 place-items-center rounded-full text-primary transition-[background-color,scale] hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-90"
              >
                <CirclePlusIcon aria-hidden className={cn("size-7 transition-transform duration-300", vehicleOpen && "rotate-45")} strokeWidth={1.6} />
              </button>
            }
          >
            {/* which vehicle is being parked: one card per vehicle, pick one */}
            <div role="radiogroup" aria-label="Vehicle to park" className="mb-m flex flex-wrap gap-xs">
              {cars.map((c, i) => {
                const active = c.id === car.id
                return (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center rounded-xl border bg-card pr-1 transition-colors",
                      active ? "border-primary bg-brand-soft/40 ring-1 ring-primary/30" : "hover:bg-secondary",
                    )}
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setCarId(c.id)}
                      className="flex min-h-14 items-center gap-xs rounded-xl py-2xs pr-s pl-xs text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", active ? "border-primary" : "border-border")}>
                        {active && <span className="size-2.5 rounded-full bg-primary" />}
                      </span>
                      <CarIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                      <span className="text-sm leading-tight">
                        <span className="block font-semibold">{c.model || `Vehicle ${i + 1}`}</span>
                        {c.plate ? (
                          <span className="plate block text-muted-foreground uppercase">{c.plate}</span>
                        ) : (
                          <span className="block text-muted-foreground">{vehicleOpen ? "Add the details below" : "Press + to add details"}</span>
                        )}
                      </span>
                    </button>
                    {cars.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCar(c.id)}
                        aria-label={`Remove ${c.model || `vehicle ${i + 1}`}`}
                        className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <XIcon aria-hidden className="size-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
              {vehicleOpen && (
                <button
                  type="button"
                  onClick={addCar}
                  className="inline-flex min-h-14 items-center gap-xs rounded-xl border border-dashed px-s text-sm font-medium text-primary transition-colors hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <CirclePlusIcon aria-hidden className="size-5" strokeWidth={1.6} />
                  Add another vehicle
                </button>
              )}
            </div>

            {vehicleOpen && (
            <div id={`${id}-vehicle-details`} className={cn(grid, "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-300")}>
              <Field label="Vehicle type" htmlFor={`${id}-vt`}>
                <Input id={`${id}-vt`} value={vehicleLabel} readOnly className={cn(field, "bg-secondary text-muted-foreground")} />
              </Field>
              <Field label="Brand and model" htmlFor={`${id}-vm`}>
                <Input id={`${id}-vm`} name="model" required autoComplete="off" placeholder="e.g. Fiat 500" className={field} value={car.model} onChange={(e) => patchCar({ model: e.target.value })} />
              </Field>
              <Field label="License plate" htmlFor={`${id}-vp`}>
                <Input id={`${id}-vp`} name="plate" required autoCapitalize="characters" spellCheck={false} placeholder="e.g. AB123CD" className={cn(field, "plate uppercase")} value={car.plate} onChange={(e) => patchCar({ plate: e.target.value.toUpperCase() })} />
              </Field>
              <Field label="Colour" optional htmlFor={`${id}-vc`}>
                <Input id={`${id}-vc`} name="colour" placeholder="e.g. Blue" className={field} value={car.colour} onChange={(e) => patchCar({ colour: e.target.value })} />
              </Field>
              <Field label="Registration country" optional htmlFor={`${id}-vr`}>
                <Input id={`${id}-vr`} name="country" autoComplete="off" placeholder="e.g. Italy" className={field} value={car.country} onChange={(e) => patchCar({ country: e.target.value })} />
              </Field>
              <Field label="Year" optional htmlFor={`${id}-vy`}>
                <Input id={`${id}-vy`} name="year" inputMode="numeric" maxLength={4} placeholder="e.g. 2019" className={field} value={car.year} onChange={(e) => patchCar({ year: e.target.value.replace(/\D/g, "") })} />
              </Field>
              <Field label="Fuel type" optional htmlFor={`${id}-vf`}>
                <SelectField id={`${id}-vf`} name="fuel" options={FUELS} placeholder="Select" value={car.fuel} onValueChange={(v) => patchCar({ fuel: v })} />
              </Field>
              <Field label="Notes for our team" optional wide htmlFor={`${id}-vn`}>
                <textarea
                  id={`${id}-vn`}
                  name="vehicleNotes"
                  rows={3}
                  placeholder="Anything we should know about the car, e.g. an existing scratch"
                  className="w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  value={car.notes}
                  onChange={(e) => patchCar({ notes: e.target.value })}
                />
              </Field>
            </div>
            )}
          </Section>

          <Section Icon={UserRoundIcon} title="Your details" hint="We send your booking summary here.">
            <div className={grid}>
              <Field label="First name" htmlFor={`${id}-fn`}>
                <Input id={`${id}-fn`} name="firstName" required autoComplete="given-name" placeholder="Marco" className={field} />
              </Field>
              <Field label="Last name" htmlFor={`${id}-ln`}>
                <Input id={`${id}-ln`} name="lastName" required autoComplete="family-name" placeholder="Rossi" className={field} />
              </Field>
              <Field label="Phone" htmlFor={`${id}-ph`}>
                <div className="flex gap-2xs">
                  <DialCodeSelect name="dial" />
                  <Input id={`${id}-ph`} name="phone" type="tel" required autoComplete="tel-national" inputMode="tel" placeholder="333 123 4567" className={cn(field, "tabular")} />
                </div>
              </Field>
              <Field label="Email" htmlFor={`${id}-em`}>
                <Input id={`${id}-em`} name="email" type="email" required autoComplete="email" inputMode="email" placeholder="you@email.com" className={field} />
              </Field>
            </div>
          </Section>

          <Section
            Icon={BriefcaseIcon}
            title="Invoice for a company"
            hint="Only if you need a business invoice."
            aside={<Toggle checked={business} onChange={setBusiness} label="Business trip" />}
          >
            {business && (
              <div className={grid}>
                <Field label="Company name" htmlFor={`${id}-cn`}>
                  <Input id={`${id}-cn`} name="company" required autoComplete="organization" placeholder="Company name" className={field} />
                </Field>
                <Field label="VAT number" htmlFor={`${id}-vat`}>
                  <Input id={`${id}-vat`} name="vat" required placeholder="e.g. IT01234567890" className={cn(field, "uppercase")} />
                </Field>
                <Field label="Address" wide htmlFor={`${id}-ba`}>
                  <Input id={`${id}-ba`} name="billingAddress" required autoComplete="address-line1" placeholder="Street and number" className={field} />
                </Field>
                <Field label="Address 2" optional wide htmlFor={`${id}-ba2`}>
                  <Input id={`${id}-ba2`} name="billingAddress2" autoComplete="address-line2" placeholder="Building, floor, unit" className={field} />
                </Field>
                <Field label="Postal code" htmlFor={`${id}-bz`}>
                  <Input id={`${id}-bz`} name="billingPostalCode" required autoComplete="postal-code" placeholder="Postal code" className={cn(field, "uppercase")} />
                </Field>
                <Field label="City" htmlFor={`${id}-bc`}>
                  <Input id={`${id}-bc`} name="billingCity" required autoComplete="address-level2" placeholder="City" className={field} />
                </Field>
                <Field label="Nation" htmlFor={`${id}-bn`}>
                  <SelectField id={`${id}-bn`} name="billingNation" required options={NATIONS} placeholder="Nation" />
                </Field>
                <Field label="Unique Code (SDI)" htmlFor={`${id}-sdi`}>
                  <Input id={`${id}-sdi`} name="sdi" required maxLength={7} autoCapitalize="characters" spellCheck={false} placeholder="Unique Code (SDI)" className={cn(field, "plate uppercase")} />
                </Field>
              </div>
            )}
          </Section>

          <Section
            Icon={PlaneIcon}
            title="Flight details"
            hint="Optional. Helps us time the shuttle to your flights."
            aside={<Toggle checked={flights} onChange={setFlights} label="Add flights" />}
          >
            {flights && (
              <div className={grid}>
                <Field label="Flying to" optional htmlFor={`${id}-dd`}>
                  <Input id={`${id}-dd`} name="destination" placeholder="e.g. London" className={field} />
                </Field>
                <Field label="Outbound flight" optional htmlFor={`${id}-df`}>
                  <Input id={`${id}-df`} name="outboundFlight" placeholder="e.g. AZ 610" className={cn(field, "uppercase")} />
                </Field>
                <Field label="Returning from" optional htmlFor={`${id}-oo`}>
                  <Input id={`${id}-oo`} name="origin" placeholder="e.g. London" className={field} />
                </Field>
                <Field label="Return flight" optional htmlFor={`${id}-of`}>
                  <Input id={`${id}-of`} name="returnFlight" placeholder="e.g. AZ 611" className={cn(field, "uppercase")} />
                </Field>
              </div>
            )}
          </Section>

          <div className="rounded-card border bg-card p-m">
            <label className="flex items-start gap-s text-sm text-muted-foreground">
              <input
                type="checkbox"
                required
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 size-5 shrink-0 accent-primary"
              />
              <span>
                I accept the{" "}
                <Link href="/terms" className="font-medium text-foreground underline underline-offset-4">terms and conditions</Link> and
                have read the privacy notice.
              </span>
            </label>
            <button
              type="submit"
              disabled={!accepted || state === "pending"}
              className="mt-m inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground transition-[background-color,opacity,scale] hover:bg-primary-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === "pending" ? "Please wait…" : t.pay === "online" ? `Pay ${eur(total)}` : "Confirm reservation"}
              {state !== "pending" && <ArrowRightIcon aria-hidden className="size-4" />}
            </button>
            <p className="mt-xs flex items-center justify-center gap-1.5 text-center text-fine text-muted-foreground">
              <LockIcon aria-hidden className="size-3.5 shrink-0" />
              <span className="[text-box:trim-both_cap_alphabetic]">Secure checkout. Cancel within 24h for a €1.99 fee.</span>
            </p>
          </div>

          {/* About the car park: one card, what's included as a tidy list, photo + map side by side */}
          <section className="mt-l rounded-card border bg-card p-m">
            <h2 className="text-h3 font-semibold">About the car park</h2>
            {/* sized by this list's own width: narrow = stacked, medium = full-width rows, wide = four cards in 2x2 */}
            <div className="@container mt-m">
            <dl className="grid gap-xs @3xl:grid-cols-2">
              {FACILITY.map(({ title, Icon, items }) => (
                <div key={title} className="rounded-xl bg-secondary p-s @lg:@max-3xl:grid @lg:@max-3xl:grid-cols-[9rem_minmax(0,1fr)] @lg:@max-3xl:items-center @lg:@max-3xl:gap-m @3xl:p-m">
                  <dt className="flex items-center gap-xs text-sm font-semibold @lg:@max-3xl:min-h-8">
                    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg bg-card text-primary shadow-sm">
                      <Icon className="size-4" />
                    </span>
                    {title}
                  </dt>
                  <dd className="mt-xs @lg:@max-3xl:mt-0 @3xl:mt-s">
                    <ul className="flex flex-col gap-y-2xs text-sm text-foreground/80 @lg:@max-3xl:flex-row @lg:@max-3xl:flex-wrap @lg:@max-3xl:gap-x-m">
                      {items.map((it) => (
                        <li key={it} className="flex items-start gap-xs @lg:whitespace-nowrap">
                          <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-primary">
                            <CheckIcon className="size-3" strokeWidth={3} />
                          </span>
                          <span className="text-pretty">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
            </div>
            {/* airport photos: three across, square */}
            <ul className="mt-m grid grid-cols-3 gap-xs">
              {GALLERY.map((g) => (
                <li key={g.src} className="relative aspect-square overflow-hidden rounded-xl bg-secondary">
                  <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 15vw, 30vw" className="object-cover transition-transform duration-500 hover:scale-105" />
                </li>
              ))}
            </ul>
            <div className="mt-xs">
              <div className="aspect-[16/9] overflow-hidden rounded-xl border bg-secondary">
                <iframe
                  title="Map of the GoPark car park"
                  src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="size-full"
                />
              </div>
            </div>
            <p className="mt-xs flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon aria-hidden className="size-4" /> {CONTACT.address.join(", ")}
            </p>
          </section>
        </form>

        {/* Summary */}
        <aside aria-label="Booking summary" className="lg:sticky lg:top-[calc(var(--header-h)+var(--space-s))]">
          <div className="stack rounded-card border bg-card p-m shadow-sm [--stack-gap:var(--space-s)]">
            <div className="text-sm">
              <p className="font-semibold">Rome Fiumicino · FCO</p>
              <p className="text-muted-foreground tabular">
                {formatDateTime(t.from)} → {formatDateTime(t.to)}
              </p>
            </div>
            <dl className="stack text-sm [--stack-gap:var(--space-2xs)]">
              <div className="flex justify-between gap-s">
                <dt className="text-muted-foreground">Vehicle</dt>
                <dd>{vehicleLabel}</dd>
              </div>
              <div className="flex justify-between gap-s">
                <dt className="text-muted-foreground">Space</dt>
                <dd>{parkingLabel}</dd>
              </div>
              <div className="flex justify-between gap-s">
                <dt className="text-muted-foreground">Passengers</dt>
                <dd className="tabular">{t.pax}</dd>
              </div>
              {t.keys && (
                <div className="flex justify-between gap-s">
                  <dt className="text-muted-foreground">{EXTRAS.keepKeys.label}</dt>
                  <dd>Free</dd>
                </div>
              )}
            </dl>
            <dl className="stack border-t pt-s text-sm [--stack-gap:var(--space-2xs)]">
              {lines.map((l) => (
                <div key={l.label} className="flex justify-between gap-s">
                  <dt className="text-muted-foreground">{l.label}</dt>
                  <dd className={cn("tabular", l.amount < 0 && "text-success")}>{l.amount ? eur(l.amount) : "Free"}</dd>
                </div>
              ))}
              {t.promo && (
                <div className="flex justify-between gap-s">
                  <dt className="text-muted-foreground">Promo code</dt>
                  <dd className="plate">{t.promo}</dd>
                </div>
              )}
            </dl>
            <div className="flex items-end justify-between gap-s border-t pt-s">
              <span className="text-sm text-muted-foreground">
                Total · {days} {days === 1 ? "day" : "days"}
              </span>
              <span className="text-h2 font-bold tabular">{eur(total)}</span>
            </div>
            <p className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm">
              <BadgeCheckIcon aria-hidden className="size-4 text-primary" />
              {t.pay === "online" ? "Pay online, securely" : "Pay at the car park"}
            </p>
          </div>
        </aside>
      </div>
    </div>
    </>
  )
}
