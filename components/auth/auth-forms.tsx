"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { CheckCircle2Icon } from "lucide-react"

import { AuthForm, Field, PasswordField, SubmitButton } from "@/components/auth/auth-fields"

const MIN_PASSWORD = 8

export function LoginForm() {
  return (
    <AuthForm submitLabel="Log in" success={{ title: "You're logged in", body: "Taking you to your bookings." }}>
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@email.com" required />
      <PasswordField name="password" autoComplete="current-password" placeholder="Enter your password" required />
      <div className="flex items-center justify-between gap-s text-sm">
        <label className="inline-flex min-h-10 items-center gap-2">
          <input type="checkbox" name="remember" className="size-4 accent-primary" /> Remember me
        </label>
        <Link href="/forgot-password" className="font-medium text-primary underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>
    </AuthForm>
  )
}

/** Create account: details, then the 6-digit code sent to their email, then success. */
export function SignupForm() {
  const [email, setEmail] = useState<string | null>(null)
  if (email) {
    return (
      <VerifyCodeForm
        sentTo={email}
        onChangeEmail={() => setEmail(null)}
        success={{ title: "Account created", body: "Your email is verified and your account is ready.", href: "/login", cta: "Log in" }}
      />
    )
  }
  return (
    <AuthForm
      submitLabel="Create account"
      onSubmitted={(d) => setEmail(String(d.get("email")))}
      validate={(d) =>
        String(d.get("password")).length < MIN_PASSWORD ? `Use at least ${MIN_PASSWORD} characters for your password.` : null
      }
    >
      <div className="grid gap-s sm:grid-cols-2">
        <Field label="First name" name="firstName" autoComplete="given-name" placeholder="Marco" required />
        <Field label="Last name" name="lastName" autoComplete="family-name" placeholder="Rossi" required />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@email.com" required />
      <PasswordField name="password" autoComplete="new-password" placeholder="Create a password" hint={`At least ${MIN_PASSWORD} characters.`} required minLength={MIN_PASSWORD} />
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="terms" required className="mt-0.5 size-4 shrink-0 accent-primary" />
        <span>
          I accept the{" "}
          <Link href="/terms" className="font-medium text-foreground underline underline-offset-4">terms</Link> and the{" "}
          <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">privacy policy</Link>.
        </span>
      </label>
    </AuthForm>
  )
}

/** Forgot password: email, then the 6-digit code, then success with a link to set a new password. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState<string | null>(null)
  if (email) {
    return (
      <VerifyCodeForm
        sentTo={email}
        onChangeEmail={() => setEmail(null)}
        success={{ title: "Code confirmed", body: "Now choose a new password for your account.", href: "/reset-password", cta: "Set a new password" }}
      />
    )
  }
  return (
    <AuthForm submitLabel="Send code" onSubmitted={(d) => setEmail(String(d.get("email")))}>
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@email.com" required />
    </AuthForm>
  )
}

export function ResetPasswordForm() {
  return (
    <AuthForm
      submitLabel="Save new password"
      success={{ title: "Password updated", body: "You can now log in with your new password." }}
      validate={(d) => {
        const p = String(d.get("password"))
        if (p.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`
        if (p !== String(d.get("confirm"))) return "The two passwords don't match."
        return null
      }}
    >
      <PasswordField label="New password" name="password" autoComplete="new-password" placeholder="Create a new password" hint={`At least ${MIN_PASSWORD} characters.`} required minLength={MIN_PASSWORD} />
      <PasswordField label="Confirm new password" name="confirm" autoComplete="new-password" placeholder="Repeat the new password" required />
    </AuthForm>
  )
}

/** Verify email: no form fields, just a resend action with a short cooldown. */
export function ResendVerification() {
  const [sent, setSent] = useState(false)
  return (
    <div className="stack [--stack-gap:var(--space-s)]">
      <button
        type="button"
        disabled={sent}
        onClick={() => {
          // TODO: call the auth provider's resend endpoint
          setSent(true)
          window.setTimeout(() => setSent(false), 30000)
        }}
        className="inline-flex h-12 w-full items-center justify-center rounded-full border bg-card px-6 font-semibold transition-colors hover:bg-secondary disabled:opacity-60"
      >
        {sent ? "Email sent. Try again in 30 seconds" : "Resend email"}
      </button>
      <p role="status" className="text-center text-sm text-muted-foreground">
        {sent ? "A new link is on its way." : "Didn't get it? Check your spam folder first."}
      </p>
    </div>
  )
}

const CODE_LENGTH = 6

/**
 * Six-box one-time code: digits only, auto-advance, backspace steps back, paste fills all boxes,
 * submits by itself once complete. TODO: verify the code with the auth provider.
 */
export function VerifyCodeForm({
  sentTo,
  onChangeEmail,
  success = { title: "Email verified", body: "Your account is ready. You can log in now.", href: "/login", cta: "Go to log in" },
}: {
  /** email the code went to, shown above the boxes */
  sentTo?: string
  onChangeEmail?: () => void
  success?: { title: string; body: string; href: string; cta: string }
} = {}) {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""))
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">("idle")
  // a code was just sent when we arrive from a previous step, so start the resend countdown
  const [cooldown, setCooldown] = useState(sentTo ? 30 : 0)
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => window.clearTimeout(t)
  }, [cooldown])

  const submit = (code: string) => {
    if (code.length !== CODE_LENGTH) {
      setState("error")
      return
    }
    setState("pending")
    // TODO: send `code` to the auth provider; on failure set "error"
    window.setTimeout(() => setState("done"), 700)
  }

  const fill = (start: number, text: string) => {
    const clean = text.replace(/\D/g, "").slice(0, CODE_LENGTH - start)
    if (!clean) return
    const next = [...digits]
    clean.split("").forEach((d, k) => (next[start + k] = d))
    setDigits(next)
    setState("idle")
    const last = Math.min(start + clean.length, CODE_LENGTH - 1)
    boxes.current[last]?.focus()
    if (next.every(Boolean)) submit(next.join(""))
  }

  if (state === "done") {
    return (
      <div role="status" className="stack items-start rounded-2xl border bg-secondary p-m [--stack-gap:var(--space-xs)]">
        <CheckCircle2Icon aria-hidden className="size-7 text-success" />
        <p className="font-semibold">{success.title}</p>
        <p className="text-sm text-muted-foreground">{success.body}</p>
        <Link href={success.href} className="mt-2xs font-medium text-primary underline-offset-4 hover:underline">{success.cta}</Link>
      </div>
    )
  }

  return (
    <form
      className="stack [--stack-gap:var(--space-m)]"
      onSubmit={(e) => {
        e.preventDefault()
        submit(digits.join(""))
      }}
    >
      {sentTo && (
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to <strong className="font-semibold break-all text-foreground">{sentTo}</strong>.{" "}
          {onChangeEmail && (
            <button type="button" onClick={onChangeEmail} className="font-medium text-primary underline-offset-4 hover:underline">
              Change email
            </button>
          )}
        </p>
      )}
      <fieldset className="stack [--stack-gap:var(--space-xs)]">
        <legend className="mb-xs text-sm font-medium">Verification code</legend>
        <div className="grid grid-cols-6 gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                boxes.current[i] = el
              }}
              value={d}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              pattern="[0-9]*"
              maxLength={CODE_LENGTH}
              aria-label={`Digit ${i + 1} of ${CODE_LENGTH}`}
              aria-invalid={state === "error" ? true : undefined}
              disabled={state === "pending"}
              onFocus={(e) => e.currentTarget.select()}
              onChange={(e) => {
                const v = e.target.value
                if (!v) {
                  const next = [...digits]
                  next[i] = ""
                  setDigits(next)
                  return
                }
                fill(i, v)
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) boxes.current[i - 1]?.focus()
                if (e.key === "ArrowLeft" && i > 0) boxes.current[i - 1]?.focus()
                if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) boxes.current[i + 1]?.focus()
              }}
              onPaste={(e) => {
                e.preventDefault()
                fill(i, e.clipboardData.getData("text"))
              }}
              className="aspect-square w-full rounded-xl border-2 border-input bg-card text-center text-2xl font-bold tabular transition-colors outline-none focus:border-primary focus:ring-3 focus:ring-primary/20 aria-invalid:border-destructive disabled:opacity-60"
            />
          ))}
        </div>
        {state === "error" && (
          <p role="alert" className="text-sm text-destructive">Enter all 6 digits of the code.</p>
        )}
      </fieldset>

      <SubmitButton pending={state === "pending"}>Verify</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Didn&apos;t get a code?{" "}
        <button
          type="button"
          disabled={cooldown > 0}
          onClick={() => {
            // TODO: ask the auth provider to send a new code
            setCooldown(30)
          }}
          className="font-medium text-primary underline-offset-4 hover:underline disabled:text-muted-foreground disabled:no-underline"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </p>
    </form>
  )
}
