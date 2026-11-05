import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDownIcon, CalendarCheckIcon, MessageCircleIcon, PaperclipIcon, PhoneIcon, StarIcon, ThumbsUpIcon, VideoIcon } from "lucide-react"

import { Reveal } from "@/components/home/reveal"
import { VideoGrid } from "@/components/home/video-testimonials"
import { DotPattern } from "@/components/layout/dot-pattern"
import { InkGrid } from "@/components/layout/ink-grid"
import { NotchTile } from "@/components/layout/notch-tile"
import { buttonVariants } from "@/components/ui/button"
import { CONTACT } from "@/lib/constants"
import { testimonialStats } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Guest videos | GoPark",
  description: "Short video clips from travellers who parked at Rome Fiumicino with GoPark.",
}

export default function TestimonialPage() {
  const phone = CONTACT.phones[0]
  // worked out from the entries in lib/testimonials.ts, so they always match the videos below
  const { count, average, recommendPct } = testimonialStats()
  const stats = [
    { icon: VideoIcon, label: "Guest videos", value: String(count), note: "filmed by travellers" },
    { icon: StarIcon, label: "Average rating", value: `${average.toFixed(1)} / 5`, note: "across every video" },
    { icon: ThumbsUpIcon, label: "Would recommend", value: `${recommendPct}%`, note: "rated 4 stars or more" },
  ]
  const actions = [
    { href: "/booking", Icon: CalendarCheckIcon, title: "Book parking", body: "A couple of minutes online.", primary: true },
    { href: "/contact", Icon: MessageCircleIcon, title: "Contact us", body: "Message the team." },
    { href: `tel:+39${phone.replace(/\s/g, "")}`, Icon: PhoneIcon, title: phone, body: "Call us, open 24/7." },
  ]

  return (
    <>
      {/* header: dark hero, text on the left and a paper stats sheet on the right (same sheet as the contact page) */}
      <section aria-labelledby="testimonial-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        {/* same edge arcs as the other heroes: gradient rings cropped by the section sides (left one lowered for this shorter hero) */}
        <div aria-hidden className="edge-arc top-[14%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />
        <div className="container-fluid grid items-center gap-xl py-xl lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="stack max-w-[40rem] [--stack-gap:var(--space-m)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md">
              <VideoIcon aria-hidden className="size-4" />
              Guest videos
            </p>
            <h1 id="testimonial-title" className="max-w-[13ch] text-hero font-bold">
              What travellers say.
            </h1>
            <p className="max-w-[44ch] text-ink-muted">Short clips from travellers, in their own words.</p>
            <div>
              <Link href="/booking" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
                Book parking
              </Link>
            </div>
          </div>

          {/* stats sheet: a paper note on the desk. Two loose sheets behind, paperclip, binder clip, highlighter labels, tape on the link. */}
          <div className="anim-sheet relative mx-auto w-full min-w-0 max-w-[28rem] py-s">
            <span aria-hidden className="sheet-back-a absolute inset-x-4 inset-y-2 rotate-[4deg] rounded-md bg-[#e9ebef] shadow-lg" />
            <span aria-hidden className="sheet-back-b absolute inset-x-2 inset-y-1 -rotate-[3deg] rounded-md bg-[#f1f2f4] shadow-lg" />

            <div className="sheet-main relative -rotate-1 rounded-md bg-[#f7f7f5] p-m text-ink shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] sm:p-l">
              <PaperclipIcon aria-hidden strokeWidth={1.6} className="sheet-clip absolute -top-6 left-6 size-14 -rotate-[20deg] text-[#9aa3b2] drop-shadow-sm" />
              <span aria-hidden className="sheet-binder absolute top-1/2 -right-3 h-14 w-6 -translate-y-1/2 rounded-sm bg-gradient-to-b from-[#3a4152] to-[#1d2230] shadow-md max-sm:hidden">
                <span className="absolute top-1/2 left-full h-8 w-5 -translate-y-1/2 rounded-r-full border-2 border-l-0 border-[#9aa3b2]" />
              </span>

              <ul className="stack [--stack-gap:var(--space-m)]">
                {stats.map(({ icon: Icon, label, value, note }) => (
                  <li key={label} className="sheet-row flex items-start gap-s">
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
                      <p className="text-4xl leading-none font-bold tracking-tight tabular">{value}</p>
                      <p className="mt-1 text-sm text-ink/60">{note}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* action on a strip of tape */}
              <a
                href="#guest-videos"
                // tape strip: torn zig-zag ends, slightly see-through
                className="sheet-tape mt-l ml-[calc(2.5rem+var(--space-s))] inline-flex h-11 -rotate-2 items-center gap-1.5 bg-[#d6dbe4]/85 px-7 text-sm font-semibold text-ink transition-transform [clip-path:polygon(0_0,100%_0,97%_12%,100%_25%,97%_38%,100%_50%,97%_62%,100%_75%,97%_88%,100%_100%,0_100%,3%_88%,0_75%,3%_62%,0_50%,3%_38%,0_25%,3%_12%)] hover:rotate-0"
              >
                Watch the videos <ArrowDownIcon aria-hidden className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* every video; wide container so four fit in a row, like the arrival guide */}
      <section id="guest-videos" aria-label="Guest videos" className="section scroll-mt-[var(--header-h)]">
        <div className="container-fluid [--container:112rem]">
          <VideoGrid />
        </div>
      </section>

      {/* CTA: same help card and notched tiles as the about page */}
      <section aria-labelledby="testimonial-cta" className="pb-section">
        <div className="container-fluid [--container:96rem]">
          <Reveal className="anim-help relative isolate grid gap-l overflow-hidden rounded-card bg-ink p-l text-ink-foreground lg:p-xl xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] xl:items-center">
            <InkGrid />
            <div className="help-copy stack [--stack-gap:var(--space-xs)]">
              <h2 id="testimonial-cta" className="text-h2 font-semibold">Ready to park with us?</h2>
              <p className="max-w-[36ch] text-ink-muted">Book online in a couple of minutes, or talk to our team.</p>
            </div>
            <ul className="grid gap-xs sm:grid-cols-3">
              {actions.map(({ href, Icon, title, body, primary }) => (
                <li key={href} className="help-tile">
                  <NotchTile href={href} Icon={Icon} title={title} body={body} primary={primary} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  )
}
