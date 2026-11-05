import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRightIcon, BusIcon, MailIcon, MapPinIcon, PaperclipIcon, PencilLineIcon, PhoneIcon, SquareParkingIcon } from "lucide-react"

import { ContactForm } from "@/components/contact/contact-form"
import { Reveal } from "@/components/home/reveal"
import { CONTACT } from "@/lib/constants"
import { DotPattern } from "@/components/layout/dot-pattern"

export const metadata: Metadata = {
  title: "Contact us | GoPark",
  description: "Get in touch with the GoPark team at Rome Fiumicino.",
}

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address.join(", "))}`
const tel = (p: string) => `tel:+39${p.replace(/\s/g, "")}`

export default function ContactPage() {
  return (
    <>
      {/* Hero: same ink language as the homepage */}
      <section
        aria-labelledby="contact-title"
        className="relative isolate overflow-hidden bg-ink text-ink-foreground"
      >
        <DotPattern />
        {/* Edge arcs: thick gradient rings cropped by the section sides */}
        <div
          aria-hidden
          className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden"
        />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />

        <div className="container-fluid grid items-center gap-l py-xl lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:min-h-[min(44rem,calc(100svh-var(--header-h)))]">
          <div className="stack [--stack-gap:var(--space-s)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md">
              <MapPinIcon aria-hidden className="size-4" />
              Rome Fiumicino
            </p>
            <h1 id="contact-title" className="max-w-[13ch] text-hero font-bold">
              Talk to the people who park your car.
            </h1>
            <p className="max-w-[40ch] text-white/85">
              Call, write or drop by. Our team at the car park answers every message.
            </p>

            <div className="flex flex-wrap gap-2xs pt-2xs">
              <Link
                href="/call-shuttle"
                className="group relative inline-flex h-11 items-center overflow-hidden rounded-full bg-white pr-5 pl-11 text-sm font-semibold text-ink shadow-[0_10px_24px_-12px_rgb(0_0_0/0.6)] transition-[padding,background-color,scale] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-brand-soft hover:pr-11 hover:pl-5 focus-visible:pr-11 focus-visible:pl-5 active:scale-[0.97]"
              >
                {/* bus drives from before the label to after it (fixed total padding = fixed width) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-9 left-5 flex items-center transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-full group-focus-visible:translate-x-full motion-reduce:transition-none"
                >
                  <BusIcon className="size-4 transition-transform group-hover:-translate-y-px" />
                </span>
                Call shuttle
              </Link>
              <Link
                href="/booking"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-semibold ring-1 ring-white/25 backdrop-blur-md transition-[background-color,scale] hover:bg-white/20 active:scale-[0.97]"
              >
                <SquareParkingIcon aria-hidden className="size-4" /> Book parking
              </Link>
            </div>
          </div>

          {/* Contact sheet: a paper note on the desk. Two loose sheets behind, paperclip on the corner,
              binder clip on the edge, highlighter swipes behind the labels, tape on the action. */}
          <div className="anim-sheet relative mx-auto w-full min-w-0 max-w-[30rem] py-s">
            {/* loose sheets underneath */}
            <span aria-hidden className="sheet-back-a absolute inset-x-4 inset-y-2 rotate-[4deg] rounded-md bg-[#e9ebef] shadow-lg" />
            <span aria-hidden className="sheet-back-b absolute inset-x-2 inset-y-1 -rotate-[3deg] rounded-md bg-[#f1f2f4] shadow-lg" />

            <div className="sheet-main relative -rotate-1 rounded-md bg-[#f7f7f5] p-m text-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] sm:p-l">
              {/* paperclip biting the top-left corner */}
              <PaperclipIcon aria-hidden strokeWidth={1.6} className="sheet-clip absolute -top-6 left-6 size-14 -rotate-[20deg] text-[#9aa3b2] drop-shadow-sm" />
              {/* binder clip on the right edge */}
              <span aria-hidden className="sheet-binder absolute top-1/2 -right-3 h-14 w-6 -translate-y-1/2 rounded-sm bg-gradient-to-b from-[#3a4152] to-[#1d2230] shadow-md max-sm:hidden">
                <span className="absolute top-1/2 left-full h-8 w-5 -translate-y-1/2 rounded-r-full border-2 border-l-0 border-[#9aa3b2]" />
              </span>

              <ul className="stack [--stack-gap:var(--space-m)]">
                <PaperRow icon={PhoneIcon} label="Phone">
                  {CONTACT.phones.map((p) => (
                    <a key={p} href={tel(p)} className="block text-lg font-semibold tabular hover:text-primary">
                      +39 {p}
                    </a>
                  ))}
                </PaperRow>
                <PaperRow icon={MailIcon} label="Email">
                  <a href={`mailto:${CONTACT.email}`} className="text-sm font-semibold break-words hover:text-primary xl:text-body">
                    {CONTACT.email.split("@")[0]}@<wbr />
                    {CONTACT.email.split("@")[1]}
                  </a>
                </PaperRow>
                <PaperRow icon={MapPinIcon} label="Car park">
                  <address className="not-italic font-semibold">
                    {CONTACT.address.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </address>
                </PaperRow>
              </ul>

              {/* action on a strip of tape */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                // tape strip: torn zig-zag ends, slightly see-through
                className="sheet-tape mt-l ml-[calc(2.5rem+var(--space-s))] inline-flex h-11 -rotate-2 items-center gap-1.5 bg-[#d6dbe4]/85 px-7 text-sm font-semibold text-ink transition-transform [clip-path:polygon(0_0,100%_0,97%_12%,100%_25%,97%_38%,100%_50%,97%_62%,100%_75%,97%_88%,100%_100%,0_100%,3%_88%,0_75%,3%_62%,0_50%,3%_38%,0_25%,3%_12%)] hover:rotate-0"
              >
                Get directions <ArrowUpRightIcon aria-hidden className="size-3.5" />
                <span className="sr-only">(opens Google Maps)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Form: calm light section, short intro column + form */}
      <section aria-labelledby="form-title" className="container-fluid py-xl">
        <div className="grid gap-l lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:items-center">
          {/* Notepad page: torn from a pad (punched holes along the top), brand-blue sheet behind, slight tilt */}
          <Reveal plain className="anim-pad relative mx-auto w-full max-w-[28rem] pt-m pr-s">
            <span aria-hidden className="pad-back notepad absolute inset-0 top-m right-0 left-s rotate-[3deg] rounded-sm bg-primary" />
            {/* round badge on the top corner (outside the sheet so the hole mask doesn't clip it) */}
            <span className="pad-badge absolute top-0 right-l z-10 grid size-16 place-items-center rounded-full bg-[#c7d8ff] text-sm font-bold text-ink shadow-sm">
              FCO
            </span>
            <div className="pad-main notepad relative -rotate-2 rounded-sm bg-ink px-m pt-[calc(var(--space-m)+19px)] pb-m text-ink-foreground shadow-[0_24px_50px_-20px_rgb(11_15_25/0.55)] ring-1 ring-white/10 xl:px-l xl:pt-[calc(var(--space-l)+19px)] xl:pb-l">
              <p className="pad-l1 flex items-center gap-1.5 text-sm font-bold">
                <span aria-hidden className="text-[#93b4ff]">❖</span> Contact form
              </p>
              <h2 id="form-title" className="pad-l2 mt-m text-[clamp(2.25rem,1.8rem+2vw,3.25rem)] leading-[1.02] font-bold tracking-tight lg:text-h1 xl:text-[3.25rem]">
                Rather <span className="text-[#93b4ff]">write it down?</span>
              </h2>
              <p className="pad-l3 mt-m max-w-[34ch] text-ink-muted">
                Add your booking reference if you have one. It helps us find your stay straight away.
              </p>

              <div className="pad-l4 mt-l flex items-end justify-between gap-s xl:mt-xl">
                <p className="text-sm text-ink-muted">
                  Quick question?
                  <Link href="/faq" className="mt-0.5 block text-lg font-bold text-white underline decoration-[#93b4ff] decoration-2 underline-offset-4 hover:text-[#93b4ff]">
                    Read the FAQ
                  </Link>
                </p>
                <span aria-hidden className="pad-pencil grid size-16 shrink-0 rotate-6 place-items-center rounded-full bg-[#c7d8ff] text-primary">
                  <PencilLineIcon className="pad-pencil-icon size-7" />
                </span>
              </div>
            </div>
          </Reveal>

          <ContactForm />
        </div>
      </section>
    </>
  )
}

/** Row on the paper sheet: label with a highlighter swipe behind it. */
function PaperRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof PhoneIcon
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="sheet-row flex items-start gap-s">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 text-primary">
        <Icon aria-hidden className="size-4.5" />
      </span>
      <div className="min-w-0">
        {/* label in a highlighter box with selection-handle dots on two corners */}
        <p className="mb-2">
          <span className="sheet-mark relative inline-block bg-[#dbe6ff] px-1.5 py-0.5 text-xs font-semibold tracking-wide text-primary">
            <span aria-hidden className="absolute -top-1 -left-1 size-2 rounded-full bg-primary" />
            <span aria-hidden className="absolute -right-1 -bottom-1 size-2 rounded-full bg-primary" />
            {label}
          </span>
        </p>
        {children}
      </div>
    </li>
  )
}
