// Options and supplements from the operator's previous booking page.
// Every price here must come from the backend tariff before launch.

export type VehicleType = "car" | "long" | "bus"
export type ParkingType = "open" | "covered"
export type PaymentMode = "online" | "lot"

export const VEHICLES: { value: VehicleType; label: string; hint: string; price: number }[] = [
  { value: "car", label: "Car", hint: "Standard cars & SUVs", price: 0 },
  { value: "long", label: "Long vehicle", hint: "Over 5 m or more than 5 seats", price: 20 },
  { value: "bus", label: "Bus", hint: "Minibuses & coaches", price: 99 },
]

export const PARKING_TYPES: { value: ParkingType; label: string; hint: string; price: number }[] = [
  { value: "open", label: "Open-air", hint: "Standard uncovered space", price: 0 },
  { value: "covered", label: "Covered", hint: "Sheltered from sun & rain", price: 100 },
]

export const EXTRAS = {
  wash: { label: "Full car wash", hint: "Interior and exterior, ready when you land.", price: 30 },
  keepKeys: { label: "Keep your keys", hint: "Hold on to your keys for the whole stay.", price: 0 },
}

export const MAX_PASSENGERS = 8

/**
 * PLACEHOLDER rule so the payment switch changes the total: paying online takes this share off the
 * subtotal, paying at the lot is the full price. TODO: replace with the real tariff / payment rules.
 */
export const ONLINE_DISCOUNT = 0.1

/** Billable days: every started 24h counts as a day (min 1). */
export function billableDays(ms: number) {
  return Math.max(1, Math.ceil(ms / 864e5))
}

/**
 * TODO: replace with real tariff from the API.
 * Placeholder calibrated to the one known data point (7 days → €31).
 */
export function baseRate(days: number) {
  return Math.round(days * 4.43 * 100) / 100
}

export type QuoteInput = {
  days: number
  vehicle: VehicleType
  parking: ParkingType
  wash: boolean
  /** How the visitor pays. Online carries the placeholder discount; at the lot is the full price. */
  pay?: PaymentMode
}

/** `key` says what a line is, so the UI can group it ("base" | "vehicle" | "parking" | "wash" | "shuttle" | "online"). */
export type QuoteLine = { key: string; label: string; amount: number }

export function quote({ days, vehicle, parking, wash, pay = "lot" }: QuoteInput) {
  const lines: QuoteLine[] = [{ key: "base", label: `Parking · ${days} ${days === 1 ? "day" : "days"}`, amount: baseRate(days) }]
  const v = VEHICLES.find((x) => x.value === vehicle)!
  if (v.price) lines.push({ key: "vehicle", label: `${v.label} supplement`, amount: v.price })
  const p = PARKING_TYPES.find((x) => x.value === parking)!
  if (p.price) lines.push({ key: "parking", label: `${p.label} space`, amount: p.price })
  if (wash) lines.push({ key: "wash", label: EXTRAS.wash.label, amount: EXTRAS.wash.price })
  lines.push({ key: "shuttle", label: "Shuttle transfer", amount: 0 })
  if (pay === "online") {
    const subtotal = lines.reduce((s, l) => s + l.amount, 0)
    lines.push({ key: "online", label: "Online payment discount", amount: -Math.round(subtotal * ONLINE_DISCOUNT * 100) / 100 })
  }
  const total = Math.round(lines.reduce((s, l) => s + l.amount, 0) * 100) / 100
  return { lines, total }
}

export const eur = (n: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(n)
