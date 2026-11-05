import { TIME_STEP_MINUTES } from "@/lib/constants"

export const pad = (n: number) => String(n).padStart(2, "0")

export const toDateValue = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const addDays = (d: Date, n: number) => {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

export const combine = (date: string, time: string) => new Date(`${date}T${time}:00`)

export const isSmallHours = (time: string) => Number(time.slice(0, 2)) < 4

export const TIME_OPTIONS = Array.from({ length: (24 * 60) / TIME_STEP_MINUTES }, (_, i) => {
  const mins = i * TIME_STEP_MINUTES
  const h = Math.floor(mins / 60)
  const m = mins % 60
  const value = `${pad(h)}:${pad(m)}`
  const h12 = h % 12 === 0 ? 12 : h % 12
  let label = `${h12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`
  if (value === "00:00") label += " (Midnight)"
  if (value === "12:00") label += " (Noon)"
  return { value, label }
})

export function formatDuration(ms: number) {
  const totalHours = Math.round(ms / 36e5)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const parts = []
  if (days) parts.push(`${days} ${days === 1 ? "day" : "days"}`)
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`)
  return parts.join(", ") || "Less than 1 hour"
}

/** Smart defaults: tomorrow 09:00, for `days` (7 = a week's trip). */
export function defaultTrip(now = new Date(), days = 7) {
  return {
    fromDate: toDateValue(addDays(now, 1)),
    fromTime: "09:00",
    toDate: toDateValue(addDays(now, 1 + days)),
    toTime: "09:00",
  }
}

export const formatDateTime = (d: Date) =>
  d.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
