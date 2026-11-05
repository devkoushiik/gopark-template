"use client"

import { useRef, useState } from "react"
import { ArrowRightIcon, CircleAlertIcon, CircleCheckIcon, LoaderCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const TOPICS = ["Booking", "Payment or refund", "Shuttle", "Damage", "Agreements", "Other"]

type Field = "firstName" | "lastName" | "email" | "topic" | "message" | "consent"
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(data: FormData): Errors {
  const e: Errors = {}
  if (!String(data.get("firstName") ?? "").trim()) e.firstName = "Enter your first name."
  if (!String(data.get("lastName") ?? "").trim()) e.lastName = "Enter your last name."
  const email = String(data.get("email") ?? "").trim()
  if (!email) e.email = "Enter your email address."
  else if (!EMAIL_RE.test(email)) e.email = "Enter a valid email, like name@example.com."
  if (!data.get("topic")) e.topic = "Choose a topic."
  if (String(data.get("message") ?? "").trim().length < 10) e.message = "Tell us a bit more (at least 10 characters)."
  if (!data.get("consent")) e.consent = "Please accept the privacy conditions to send your message."
  return e
}

const fieldClass =
  "w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const next = validate(data)
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus("sending")
    try {
      // TODO: POST to contact endpoint
      await new Promise((r) => setTimeout(r, 800))
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  // Re-validate a single field on blur once it has an error.
  function onBlur(e: React.FocusEvent<HTMLFormElement>) {
    const name = (e.target as unknown as HTMLInputElement).name as Field
    if (!errors[name] || !formRef.current) return
    const next = validate(new FormData(formRef.current))
    setErrors((prev) => ({ ...prev, [name]: next[name] }))
  }

  if (status === "sent") {
    return (
      <div role="status" className="stack items-start rounded-card border bg-success-surface p-l [--stack-gap:var(--space-xs)]">
        <CircleCheckIcon aria-hidden className="size-8 text-success" />
        <h2 className="text-h3 font-semibold">Message sent</h2>
        <p className="text-muted-foreground">Thanks for reaching out. We&apos;ll reply to your email as soon as possible.</p>
        <Button variant="outline" className="bg-card" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    )
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${f}-error`} className="flex items-center gap-2xs text-sm text-destructive">
        <CircleAlertIcon aria-hidden className="size-4 shrink-0" />
        {errors[f]}
      </p>
    ) : null
  const a11y = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? `${f}-error` : undefined,
  })

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onBlur={onBlur}
      aria-labelledby="form-title"
      className="@container rounded-card border bg-card p-m shadow-[0_24px_48px_-32px_rgb(11_15_25/0.35)]"
    >
      <div className="stack">
        <p className="text-sm text-muted-foreground">All fields required unless marked optional.</p>

        {status === "error" && (
          <p role="alert" className="flex items-start gap-2xs rounded-lg bg-destructive-surface p-xs text-sm">
            <CircleAlertIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-destructive" />
            Something went wrong sending your message. Your text is kept, please try again.
          </p>
        )}

        <div className="grid gap-s @md:grid-cols-2">
          <div className="stack [--stack-gap:var(--space-2xs)]">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" autoComplete="given-name" placeholder="Marco" {...a11y("firstName")} />
            {err("firstName")}
          </div>
          <div className="stack [--stack-gap:var(--space-2xs)]">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" autoComplete="family-name" placeholder="Rossi" {...a11y("lastName")} />
            {err("lastName")}
          </div>
        </div>

        <div className="grid gap-s @md:grid-cols-2">
          <div className="stack [--stack-gap:var(--space-2xs)]">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" {...a11y("email")} />
            {err("email")}
          </div>
          <div className="stack [--stack-gap:var(--space-2xs)]">
            <Label htmlFor="bookingRef">
              Booking reference <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="bookingRef"
              name="bookingRef"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="e.g. GP-7K3Q-21"
              className="plate"
            />
          </div>
        </div>

        <fieldset className="stack [--stack-gap:var(--space-2xs)]" {...a11y("topic")}>
          <legend className="mb-2xs text-sm font-medium">Topic</legend>
          <div className="cluster gap-2xs">
            {TOPICS.map((t) => (
              <label
                key={t}
                className="inline-flex min-h-11 cursor-pointer items-center rounded-full border bg-card px-4 text-sm transition-colors hover:bg-secondary has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-3 has-focus-visible:ring-ring/50"
              >
                <input type="radio" name="topic" value={t} className="sr-only" />
                {t}
              </label>
            ))}
          </div>
          {err("topic")}
        </fieldset>

        <div className="stack [--stack-gap:var(--space-2xs)]">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="How can we help? Include your dates or booking details if you have them."
            className={cn(fieldClass, "min-h-36 resize-y py-2.5")}
            {...a11y("message")}
          />
          {err("message")}
        </div>

        <div className="stack [--stack-gap:var(--space-2xs)]">
          <label className="flex cursor-pointer items-start gap-xs text-sm">
            <input
              type="checkbox"
              name="consent"
              className="mt-0.5 size-5 shrink-0 accent-primary"
              {...a11y("consent")}
            />
            <span>
              I have read and accept the privacy conditions for processing my personal data.
            </span>
          </label>
          {err("consent")}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <LoaderCircleIcon aria-hidden className="animate-spin" /> Sending...
            </>
          ) : (
            <>
              Send message <ArrowRightIcon aria-hidden />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
