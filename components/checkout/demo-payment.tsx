"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeftIcon, CheckIcon, CreditCardIcon, GlobeIcon, InfoIcon, LandmarkIcon, SmartphoneIcon, WalletIcon } from "lucide-react"

import { DotPattern } from "@/components/layout/dot-pattern"
import { cn } from "@/lib/utils"

type Method = { id: string; label: string; Icon: typeof CreditCardIcon }

// All placeholders: nothing is charged and nothing is collected.
const WALLETS = [
  { id: "apple", label: "Apple Pay" },
  { id: "google", label: "Google Pay" },
] as const
const METHODS: Method[] = [
  { id: "card", label: "Card", Icon: CreditCardIcon },
  { id: "revolut", label: "Revolut Pay", Icon: WalletIcon },
  { id: "bancontact", label: "Bancontact", Icon: LandmarkIcon },
  { id: "eps", label: "EPS", Icon: GlobeIcon },
]

const STEPS = ["Trip", "Your details", "Payment"]
const CURRENT_STEP = 2

/**
 * PLACEHOLDER payment step shown between "Pay" on the checkout form and the success message.
 * It looks like a payment page so the flow can be tried end to end, but it takes no card details and
 * charges nothing. TODO: replace with the redirect to the real payment provider.
 */
export function DemoPayment({ total, onBack, onPaid }: { total: number; onBack: () => void; onPaid: () => void }) {
  const [method, setMethod] = useState("card")
  const [paying, setPaying] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const pay = () => {
    setPaying(true)
    // TODO: confirm the payment with the provider
    timer.current = window.setTimeout(onPaid, 1400)
  }

  const amount = new Intl.NumberFormat("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total)

  return (
    <>
      {/* dark top band, same as the checkout page: back pill, title, progress */}
      <section aria-labelledby="payment-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        <div aria-hidden className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div aria-hidden className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden" />
        <div className="container-fluid stack pt-l pb-[calc(var(--space-xl)+var(--space-l))] [--stack-gap:var(--space-s)]">
          <button
            type="button"
            onClick={onBack}
            disabled={paying}
            className="group inline-flex min-h-10 w-fit items-center gap-2 rounded-full bg-white/10 py-1 pr-4 pl-1 text-sm font-medium text-white ring-1 ring-white/15 backdrop-blur-md transition-colors outline-none hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
          >
            <span className="grid size-8 place-items-center rounded-full bg-white text-ink transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowLeftIcon aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" />
            </span>
            Back to booking
          </button>
          <h1 id="payment-title" className="text-h1 font-bold">Complete your booking.</h1>
          <p className="max-w-[44ch] text-ink-muted">Demo payment page. No real payment is taken.</p>
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
                  <span className={cn("font-medium", done && "text-white/80", current && "text-white", !current && "max-sm:sr-only")}>{step}</span>
                  {i < STEPS.length - 1 && <span aria-hidden className={cn("ml-xs h-px w-6 sm:w-12", done ? "bg-primary" : "bg-white/20")} />}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <div className="bg-secondary">
        <div className="container-fluid relative z-10 -mt-[calc(var(--space-xl)+var(--space-s))] pb-section">
          <div className="grid gap-l lg:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)] lg:items-start">
            {/* total: first on phones, right column from lg */}
            <aside aria-label="Total" className="relative isolate lg:col-start-2 lg:row-start-1 overflow-hidden rounded-card bg-[linear-gradient(135deg,var(--primary),#1d3f9e)] p-m text-white shadow-[0_24px_40px_-18px_rgb(37_99_235/0.55)] lg:sticky lg:top-[calc(var(--header-h)+var(--space-s))]">
              <DotPattern />
              <p className="text-fine font-semibold tracking-wider text-white/75 uppercase">Total to pay</p>
              <p className="mt-2xs flex items-baseline gap-xs">
                <span className="text-5xl font-bold tabular">{amount}</span>
                <span className="text-lg text-white/75">EUR</span>
              </p>

              <div className="mt-m flex items-center gap-xs border-t border-white/20 pt-m">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-lg font-extrabold text-primary">
                  P
                </span>
                <p className="text-sm font-semibold">
                  GoPark
                  <span className="block font-normal text-white/75">Rome Fiumicino parking</span>
                </p>
              </div>

              <p className="mt-m flex items-start gap-xs rounded-xl bg-white/15 p-s text-xs text-white/90 ring-1 ring-white/25">
                <InfoIcon aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                Demo only: no payment details are collected or stored.
              </p>
            </aside>

            {/* payment method: below the total on phones, left column from lg */}
            <section className="rounded-card border bg-card p-m shadow-sm lg:col-start-1 lg:row-start-1">
              <div className="flex items-center gap-s">
                <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-primary">
                  <WalletIcon className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">Payment method</h2>
                  <p className="text-sm text-muted-foreground">Choose how you would like to pay.</p>
                </div>
              </div>

              <div role="radiogroup" aria-label="Payment method" className="stack mt-m [--stack-gap:var(--space-s)]">
                {/* wallets */}
                <div className="grid gap-xs sm:grid-cols-2">
                  {WALLETS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={method === id}
                      onClick={() => setMethod(id)}
                      className={cn(
                        "flex h-14 items-center justify-center gap-2 rounded-xl bg-ink text-base font-semibold text-white outline-none transition-[box-shadow,opacity] focus-visible:ring-3 focus-visible:ring-ring/60",
                        method === id ? "ring-3 ring-primary" : "hover:opacity-85",
                      )}
                    >
                      <SmartphoneIcon aria-hidden className="size-4" />
                      {label}
                    </button>
                  ))}
                </div>

                <p className="flex items-center gap-xs text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  <span aria-hidden className="h-px flex-1 bg-border" />
                  or pay with
                  <span aria-hidden className="h-px flex-1 bg-border" />
                </p>

                {/* methods */}
                <div className="grid gap-xs sm:grid-cols-2">
                  {METHODS.map(({ id, label, Icon }) => {
                    const active = method === id
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setMethod(id)}
                        className={cn(
                          "flex min-h-16 items-center gap-s rounded-xl border px-s text-left text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                          active ? "border-primary bg-brand-soft/40 ring-1 ring-primary/30" : "bg-card hover:bg-secondary",
                        )}
                      >
                        <span aria-hidden className={cn("grid size-10 shrink-0 place-items-center rounded-full", active ? "bg-primary text-primary-foreground" : "bg-brand-soft text-primary")}>
                          <Icon className="size-5" />
                        </span>
                        <span className="flex-1 font-semibold">{label}</span>
                        <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", active ? "border-primary" : "border-border")}>
                          {active && <span className="size-2.5 rounded-full bg-primary" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={pay}
                disabled={paying}
                className="mt-m inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground transition-[background-color,opacity,scale] hover:bg-primary-hover active:scale-[0.99] disabled:opacity-70"
              >
                {paying ? "Processing…" : `Pay €${amount}`}
              </button>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}
