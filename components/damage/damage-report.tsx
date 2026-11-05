"use client"

import { useId, useRef, useState } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  CheckIcon,
  FileTextIcon,
  ImageUpIcon,
  ShieldCheckIcon,
  XIcon,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type Uploads = { checkIn: File[]; checkOut: File[]; invoice: File[] }
type Details = { ref: string; plate: string; firstName: string; lastName: string; email: string; description: string }

const EMPTY: Details = { ref: "", plate: "", firstName: "", lastName: "", email: "", description: "" }
const STEPS = ["Details & photos", "Review & submit"]
const MAX_MB = 20

/** Drag-and-drop area with a file list; keyboard users get a normal file button. */
function Dropzone({
  id,
  label,
  hint,
  optional,
  accept,
  files,
  onChange,
  error,
}: {
  id: string
  label: string
  hint: string
  optional?: boolean
  accept: string
  files: File[]
  onChange: (f: File[]) => void
  error?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const add = (list: FileList | null) => {
    if (!list) return
    const ok = Array.from(list).filter((f) => f.size <= MAX_MB * 1024 * 1024)
    onChange([...files, ...ok])
  }
  return (
    <div className="stack [--stack-gap:var(--space-2xs)]">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {optional && <span className="font-normal text-muted-foreground"> (optional)</span>}
        </Label>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          add(e.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2xs rounded-2xl border-2 border-dashed px-m py-l text-center transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
          over ? "border-primary bg-brand-soft" : error ? "border-destructive/60" : "border-border hover:border-primary/50 hover:bg-secondary",
        )}
      >
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-brand-soft text-primary">
          <ImageUpIcon className="size-5" />
        </span>
        <span className="text-sm">
          <span className="font-semibold text-primary">Choose files</span> or drag them here
        </span>
        <span className="text-fine text-muted-foreground">Photos, videos or PDF, up to {MAX_MB} MB each</span>
        <input ref={input} id={id} type="file" multiple accept={accept} className="sr-only" onChange={(e) => add(e.target.files)} />
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {files.length > 0 && (
        <ul className="stack [--stack-gap:var(--space-3xs)]">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-xs rounded-lg bg-secondary px-s py-2 text-sm">
              <FileTextIcon aria-hidden className="size-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate">{f.name}</span>
              <span className="text-fine text-muted-foreground tabular">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
              <button
                type="button"
                aria-label={`Remove ${f.name}`}
                onClick={() => onChange(files.filter((_, k) => k !== i))}
                className="grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function DamageReport() {
  const id = useId()
  const [step, setStep] = useState(0)
  const [d, setD] = useState<Details>(EMPTY)
  const [files, setFiles] = useState<Uploads>({ checkIn: [], checkOut: [], invoice: [] })
  const [tried, setTried] = useState(false)
  const [state, setState] = useState<"idle" | "pending" | "done">("idle")
  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setD((x) => ({ ...x, [k]: e.target.value }))

  if (state === "done") {
    return (
      <div role="status" className="mx-auto stack max-w-[34rem] items-center rounded-card border bg-card p-l text-center [--stack-gap:var(--space-s)]">
        <CheckCircle2Icon aria-hidden className="size-12 text-success" />
        <h2 className="text-h2 font-bold">Report received</h2>
        <p className="text-muted-foreground">
          Thanks, {d.firstName}. Our team will review your claim and reply to <strong className="text-foreground">{d.email}</strong> within 2 working days.
        </p>
      </div>
    )
  }

  const field = "h-12"
  const missingPhotos = tried && (files.checkIn.length === 0 || files.checkOut.length === 0)

  return (
    <>
      {/* steps, above the card: a progress line per step with its label underneath */}
      <ol className="mx-auto mb-m grid max-w-[44rem] grid-cols-2 gap-s">
        {STEPS.map((st, i) => (
          <li key={st} aria-current={i === step ? "step" : undefined} className="stack [--stack-gap:var(--space-2xs)]">
            <span className={cn("h-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-border")} />
            <span className={cn("flex items-center gap-1.5 text-sm", i <= step ? "font-medium text-foreground" : "text-muted-foreground")}>
              {i < step ? <CheckIcon aria-hidden className="size-4 text-primary" /> : <span className="tabular text-muted-foreground">0{i + 1}</span>}
              {st}
            </span>
          </li>
        ))}
      </ol>
    <div className="mx-auto max-w-[44rem] rounded-card border bg-card p-m shadow-sm sm:p-l">

      {step === 0 ? (
        <form
          className="stack [--stack-gap:var(--space-m)]"
          onSubmit={(e) => {
            e.preventDefault()
            setTried(true)
            if (files.checkIn.length === 0 || files.checkOut.length === 0) return
            setStep(1)
            window.scrollTo({ top: 0, behavior: "smooth" })
          }}
        >
          <div className="grid gap-s sm:grid-cols-2">
            {(
              [
                ["ref", "Booking reference", "off", "e.g. GP-7K3Q-21"],
                ["plate", "License plate", "off", "e.g. AB123CD"],
                ["firstName", "First name", "given-name", "Marco"],
                ["lastName", "Last name", "family-name", "Rossi"],
              ] as const
            ).map(([k, label, ac, ph]) => (
              <div key={k} className="stack [--stack-gap:var(--space-3xs)]">
                <Label htmlFor={`${id}-${k}`} className="text-sm font-medium">{label}</Label>
                <Input
                  id={`${id}-${k}`}
                  required
                  autoComplete={ac}
                  placeholder={ph}
                  value={d[k]}
                  onChange={set(k)}
                  className={cn(field, (k === "ref" || k === "plate") && "plate uppercase")}
                />
              </div>
            ))}
            <div className="stack [--stack-gap:var(--space-3xs)] sm:col-span-2">
              <Label htmlFor={`${id}-email`} className="text-sm font-medium">Email</Label>
              <Input id={`${id}-email`} type="email" required autoComplete="email" placeholder="you@email.com" value={d.email} onChange={set("email")} className={field} />
            </div>
            <div className="stack [--stack-gap:var(--space-3xs)] sm:col-span-2">
              <Label htmlFor={`${id}-desc`} className="text-sm font-medium">
                What happened? <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <textarea
                id={`${id}-desc`}
                rows={4}
                placeholder="Describe the damage and where on the car it is."
                value={d.description}
                onChange={set("description")}
                className="w-full rounded-lg border border-input bg-card px-3 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </div>

          <div className="stack border-t pt-m [--stack-gap:var(--space-m)]">
            <Dropzone
              id={`${id}-in`}
              label="Photos at drop-off"
              hint="Show the car's condition when you left it. Include close-ups."
              accept="image/*,video/*"
              files={files.checkIn}
              onChange={(f) => setFiles((x) => ({ ...x, checkIn: f }))}
              error={missingPhotos && files.checkIn.length === 0 ? "Add at least one photo or video." : undefined}
            />
            <Dropzone
              id={`${id}-out`}
              label="Photos at pick-up"
              hint="Show the damage clearly."
              accept="image/*,video/*"
              files={files.checkOut}
              onChange={(f) => setFiles((x) => ({ ...x, checkOut: f }))}
              error={missingPhotos && files.checkOut.length === 0 ? "Add at least one photo or video." : undefined}
            />
            <Dropzone
              id={`${id}-inv`}
              label="Repair estimate or invoice"
              optional
              hint="PDF or image."
              accept="image/*,application/pdf"
              files={files.invoice}
              onChange={(f) => setFiles((x) => ({ ...x, invoice: f }))}
            />
          </div>

          <button type="submit" className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground transition-[background-color,scale] hover:bg-primary-hover active:scale-[0.99]">
            Review report <ArrowRightIcon aria-hidden className="size-4" />
          </button>
        </form>
      ) : (
        <div className="stack [--stack-gap:var(--space-m)]">
          <dl className="grid gap-xs sm:grid-cols-2">
            {[
              ["Booking reference", d.ref.toUpperCase()],
              ["License plate", d.plate.toUpperCase()],
              ["Name", `${d.firstName} ${d.lastName}`],
              ["Email", d.email],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary px-s py-xs">
                <dt className="text-fine text-muted-foreground">{k}</dt>
                <dd className="mt-0.5 truncate text-sm font-semibold">{v}</dd>
              </div>
            ))}
            {d.description && (
              <div className="rounded-xl bg-secondary px-s py-xs sm:col-span-2">
                <dt className="text-fine text-muted-foreground">What happened</dt>
                <dd className="mt-0.5 text-sm whitespace-pre-line">{d.description}</dd>
              </div>
            )}
          </dl>
          <ul className="grid gap-xs sm:grid-cols-3">
            {(
              [
                ["Drop-off photos", files.checkIn.length],
                ["Pick-up photos", files.checkOut.length],
                ["Estimate / invoice", files.invoice.length],
              ] as const
            ).map(([k, n]) => (
              <li key={k} className="rounded-xl border px-s py-xs">
                <p className="text-fine text-muted-foreground">{k}</p>
                <p className="text-sm font-semibold">{n} {n === 1 ? "file" : "files"}</p>
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-xs rounded-xl bg-brand-soft p-s text-sm">
            <ShieldCheckIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            We compare your photos with our own check-in records and CCTV before replying.
          </p>
          <div className="flex flex-col-reverse gap-xs sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border bg-card px-6 font-semibold hover:bg-secondary"
            >
              <ArrowLeftIcon aria-hidden className="size-4" /> Edit
            </button>
            <button
              type="button"
              disabled={state === "pending"}
              onClick={() => {
                setState("pending")
                // TODO: upload the files and send the report to the claims API
                window.setTimeout(() => setState("done"), 900)
              }}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
            >
              {state === "pending" ? "Sending…" : "Submit report"}
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
