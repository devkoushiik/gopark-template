"use client"

import { useId, useState } from "react"
import { ArrowRightIcon, CheckCircle2Icon, EyeIcon, EyeOffIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Label above the input, optional hint or error below (never placeholder-as-label). */
export function Field({
  label,
  hint,
  error,
  className,
  ...props
}: React.ComponentProps<"input"> & { label: string; hint?: string; error?: string }) {
  const id = useId()
  const help = error ?? hint
  return (
    <div className={cn("stack [--stack-gap:var(--space-3xs)]", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-invalid={error ? true : undefined} aria-describedby={help ? `${id}-help` : undefined} className="h-12" {...props} />
      {help && (
        <p id={`${id}-help`} className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}>
          {help}
        </p>
      )}
    </div>
  )
}

/** Password input with a show/hide toggle. */
export function PasswordField({
  label = "Password",
  hint,
  error,
  ...props
}: React.ComponentProps<"input"> & { label?: string; hint?: string; error?: string }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const help = error ?? hint
  return (
    <div className="stack [--stack-gap:var(--space-3xs)]">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={help ? `${id}-help` : undefined}
          className="h-12 pr-12"
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
      {help && (
        <p id={`${id}-help`} className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}>
          {help}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({ children, pending }: { children: React.ReactNode; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-[background-color,scale] hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
      {!pending && <ArrowRightIcon aria-hidden className="size-4" />}
    </button>
  )
}

/**
 * Form wrapper for the auth pages. Validates with the browser plus an optional `validate`,
 * then shows `success`. TODO: replace the timeout with the real auth provider call.
 */
export function AuthForm({
  children,
  submitLabel,
  success,
  validate,
  onSubmitted,
}: {
  children: React.ReactNode
  submitLabel: string
  /** shown after submit, unless `onSubmitted` hands off to a next step (e.g. the code form) */
  success?: { title: string; body: string }
  validate?: (data: FormData) => string | null
  onSubmitted?: (data: FormData) => void
}) {
  const [state, setState] = useState<"idle" | "pending" | "done">("idle")
  const [error, setError] = useState<string | null>(null)

  if (state === "done" && success) {
    return (
      <div role="status" className="stack items-start rounded-2xl border bg-secondary p-m [--stack-gap:var(--space-xs)]">
        <CheckCircle2Icon aria-hidden className="size-7 text-success" />
        <p className="font-semibold">{success.title}</p>
        <p className="text-sm text-muted-foreground">{success.body}</p>
      </div>
    )
  }

  return (
    <form
      noValidate={false}
      className="stack [--stack-gap:var(--space-s)]"
      onSubmit={(e) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const msg = validate?.(data) ?? null
        setError(msg)
        if (msg) return
        setState("pending")
        // TODO: connect to the auth provider (e.g. Supabase, Clerk or the booking backend)
        window.setTimeout(() => {
          if (onSubmitted) onSubmitted(data)
          else setState("done")
        }, 700)
      }}
    >
      {children}
      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <SubmitButton pending={state === "pending"}>{submitLabel}</SubmitButton>
    </form>
  )
}
