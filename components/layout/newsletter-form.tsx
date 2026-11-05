"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NewsletterForm({ inline = false }: { inline?: boolean }) {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <p role="status" className={inline ? "flex items-center gap-2xs text-sm font-medium text-primary-foreground" : "flex items-center gap-2xs text-sm text-ink-muted"}>
        <CheckIcon aria-hidden className="size-4 text-success" /> Thanks, you&apos;re subscribed.
      </p>
    )
  }

  return (
    <form
      className={inline ? "flex flex-col gap-2xs sm:flex-row" : "stack [--stack-gap:var(--space-2xs)]"}
      onSubmit={(e) => {
        e.preventDefault()
        // TODO: wire to newsletter provider
        setDone(true)
      }}
    >
      <Label htmlFor="newsletter-email" className="sr-only">Email address</Label>
      <Input
        id="newsletter-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder="you@email.com"
        className={
          inline
            ? "h-12 shrink-0 rounded-full sm:flex-1 border-white/15 bg-white/5 px-5 text-white placeholder:text-white/45 focus-visible:ring-primary/50"
            : "border-white/15 bg-white/5 text-white placeholder:text-ink-subtle"
        }
      />
      <Button
        type="submit"
        className={inline ? "h-12 rounded-full bg-primary px-l font-semibold text-primary-foreground hover:bg-primary-hover" : "w-full"}
      >
        Subscribe <ArrowRightIcon aria-hidden />
      </Button>
    </form>
  )
}
