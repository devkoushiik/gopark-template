"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRightIcon, BadgeCheckIcon, Maximize2Icon, PauseIcon, PlayIcon, QuoteIcon, StarIcon, XIcon } from "lucide-react"

import { Reveal } from "@/components/home/reveal"
import { SectionHeading } from "@/components/home/section-heading"
import { isFastConnection } from "@/components/home/use-hd-video"
import { buttonVariants } from "@/components/ui/button"
import { TESTIMONIALS, type Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

/** Cards per row on wide screens: the stagger restarts every row. */
const ROW = 4

/** The autoplay card only starts by itself when the visitor hasn't asked for less motion and the connection can afford it. */
const autoplayOk = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches && isFastConnection()

const RING = 2 * Math.PI * 20 // play-button progress ring, r = 20

/** Rounded square behind the guest portrait (200x200 box, 172 wide, corner radius 40). */
const SHAPE = "M54 14 H146 A40 40 0 0 1 186 54 V146 A40 40 0 0 1 146 186 H54 A40 40 0 0 1 14 146 V54 A40 40 0 0 1 54 14 Z"
/** The square sits 10 units lower than the portrait, so the head rises slightly out of its top edge while the shape still covers the picture's bottom. */
const SHAPE_DROP = "translate(0 10)"

function VideoCard({
  t,
  i,
  autoplay,
  onExpand,
  className,
}: {
  t: Testimonial
  i: number
  /** Only the first card of a grid plays by itself; every other card waits for the play button. */
  autoplay: boolean
  onExpand: () => void
  className?: string
}) {
  const media = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const [loaded, setLoaded] = useState(false) // src attached: the autoplay card near the viewport, any card once play is pressed
  const [visible, setVisible] = useState(false)
  const [intent, setIntent] = useState<boolean | undefined>(undefined) // visitor's own play / pause choice
  const [playing, setPlaying] = useState(false)

  // autoplay card only: fetch nothing until it is within ~300px of the viewport
  useEffect(() => {
    if (!autoplay) return
    const el = media.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        if (autoplayOk()) setLoaded(true)
      },
      { rootMargin: "300px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [autoplay])

  // play only while at least half of the video is on screen
  useEffect(() => {
    const el = media.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // the visitor's choice wins; without one, only the autoplay card plays
  useEffect(() => {
    const v = video.current
    if (!v || !loaded) return
    if (visible && (intent ?? (autoplay && autoplayOk()))) v.play().catch(() => {})
    else v.pause()
  }, [loaded, visible, intent, autoplay])

  const toggle = () => {
    if (!loaded) {
      setLoaded(true)
      setIntent(true)
      return
    }
    setIntent(!(intent ?? (autoplay && autoplayOk())))
  }

  return (
    <Reveal
      as="li"
      delay={(i % ROW) * 120}
      className={cn(
        "group relative isolate flex min-h-[clamp(26rem,34vw,32rem)] flex-col justify-end overflow-hidden rounded-card border-[3px] border-neutral-950 bg-ink p-m text-ink-foreground transition-shadow duration-500 hover:shadow-[0_24px_48px_-24px_rgb(11_15_25/0.5)]",
        className,
      )}
    >
      {/* media: the clip fills the whole card and runs behind the text; only a soft scrim darkens the lower part */}
      <div ref={media} className="absolute inset-0 -z-10 overflow-hidden">
        {/* backdrop while the clip is not playing: brand glow + faint isometric lattice (the video covers it once it plays) */}
        <span
          aria-hidden
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
          style={{
            backgroundImage:
              "radial-gradient(70% 55% at 50% 35%, rgb(37 99 235 / 0.34), transparent 70%), repeating-linear-gradient(30deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 22px), repeating-linear-gradient(150deg, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 22px)",
          }}
        />
        {/* while the clip is not playing: a rounded square with the guest's cut-out portrait inside it (the video covers all of this once it plays).
            The portrait is clipped by the shape, so its bottom is covered by the shape's edge; above the middle it is not clipped, so the head rises out of the top. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[16%] mx-auto aspect-square w-[60%] transition-transform duration-500 group-hover:scale-105">
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full overflow-visible drop-shadow-[0_14px_22px_rgb(11_15_25/0.45)]">
            <defs>
              <linearGradient id={`blob-${t.id}`} x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#4f86ff" />
                <stop offset="1" stopColor="#1d3f9e" />
              </linearGradient>
              {/* the shape, plus everything above y=50: the head may pass the top edge, nothing may pass the bottom */}
              <clipPath id={`blobclip-${t.id}`}>
                <path d={SHAPE} transform={SHAPE_DROP} />
                <rect x="-60" y="-80" width="320" height="130" />
              </clipPath>
            </defs>
            <path d={SHAPE} transform={SHAPE_DROP} fill={`url(#blob-${t.id})`} />
            <g clipPath={`url(#blobclip-${t.id})`}>
              <image href={t.photo} x="0.5" y="-8" width="199" height="207" transform="rotate(-2 100 100)" />
            </g>
          </svg>
        </div>

        <video
          ref={video}
          src={loaded ? t.src : undefined}
          muted
          playsInline
          preload={loaded ? "auto" : "none"}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          className="absolute inset-0 size-full object-cover object-[50%_30%] transition-transform duration-700 group-hover:scale-105"
          onLoadedMetadata={(e) => {
            e.currentTarget.currentTime = t.start
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => {
            const v = e.currentTarget
            const span = v.duration - t.start
            if (ring.current && span > 0) {
              const p = Math.min(1, Math.max(0, (v.currentTime - t.start) / span))
              ring.current.style.strokeDashoffset = String(RING * (1 - p))
            }
          }}
          // no native loop: each card loops from its own start second
          onEnded={(e) => {
            e.currentTarget.currentTime = t.start
            e.currentTarget.play().catch(() => {})
          }}
        />

        {/* soft scrims: a light one at the top for the pill and buttons, a gentle one at the bottom for the text */}
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(11_15_25/0.46),transparent_30%)]" />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_15_25/0.86)_0%,rgb(11_15_25/0.6)_32%,rgb(11_15_25/0.22)_60%,transparent_80%)]" />
        <span aria-hidden className="pointer-events-none absolute -top-10 -right-10 size-44 rounded-full bg-primary/40 blur-3xl" />
        {/* soft film grain over the footage; static so it costs nothing per frame (same as the arrival cards) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* top row: verified pill + play / pause with a progress ring */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-m">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 py-1.5 pr-3 pl-2 text-xs font-semibold ring-1 ring-white/20 backdrop-blur-sm">
            <BadgeCheckIcon aria-hidden className="size-4 text-[#93b4ff]" />
            Verified guest
          </span>
          <div className="flex items-center gap-2xs">
          <button
            type="button"
            onClick={onExpand}
            aria-label="Watch the full video"
            aria-haspopup="dialog"
            className="grid size-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm transition-[background-color,scale] hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90"
          >
            <Maximize2Icon aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause video" : "Play video"}
            className="relative grid size-11 place-items-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur-sm transition-[background-color,scale] hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90"
          >
            <svg aria-hidden viewBox="0 0 44 44" className="absolute inset-0 size-full -rotate-90">
              <circle
                ref={ring}
                cx="22"
                cy="22"
                r="20"
                fill="none"
                stroke="#93b4ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING}
                strokeDashoffset={RING}
              />
            </svg>
            {playing ? <PauseIcon aria-hidden className="size-4 fill-current" /> : <PlayIcon aria-hidden className="size-4 translate-x-px fill-current" />}
          </button>
          </div>
        </div>
      </div>

      {/* text: quote badge + stars, the quote, who */}
      <figure className="relative [text-shadow:0_1px_14px_rgb(0_0_0/0.4)]">
        <div className="mb-xs flex items-center justify-between">
          <span aria-hidden className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[inset_0_-3px_0_rgb(0_0_0/0.2)]">
            <QuoteIcon className="size-4 fill-current" />
          </span>
          <span role="img" aria-label={`Rated ${t.rating} out of 5`} className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((s) => (
              <StarIcon key={s} aria-hidden className={s < t.rating ? "size-4 fill-[#facc15] text-[#facc15]" : "size-4 text-white/25"} />
            ))}
          </span>
        </div>
        <blockquote className="text-h3 leading-snug font-semibold text-balance">{t.quote}</blockquote>
        <figcaption className="mt-xs text-ink-muted">
          <span className="font-semibold text-ink-foreground">{t.name}</span> · {t.trip}
        </figcaption>
      </figure>
    </Reveal>
  )
}

/** Modal viewer for the whole clip: native <dialog> (focus trap, Esc, backdrop) and no extra JS; the file is only fetched when opened. */
function VideoLightbox({ t, onClose }: { t: Testimonial | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (t && !d.open) d.showModal()
    else if (!t && d.open) d.close()
  }, [t])

  return (
    <dialog
      ref={dialog}
      aria-label="Guest video"
      onClose={onClose}
      // a click on the dimmed backdrop lands on the dialog itself
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close()
      }}
      className="m-auto w-fit max-w-[94vw] overflow-visible border-0 bg-transparent p-0 text-ink-foreground backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
    >
      {t && (
        <figure className="relative">
          <video
            src={t.src}
            controls
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            className="block aspect-[9/16] h-[min(78svh,46rem)] max-w-[94vw] rounded-card bg-ink object-cover ring-4 ring-card"
          />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close video"
            className="absolute top-2 right-2 grid size-10 place-items-center rounded-full bg-ink/60 text-white ring-1 ring-white/25 backdrop-blur-sm transition-[background-color,scale] hover:bg-ink/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-90"
          >
            <XIcon aria-hidden className="size-4" />
          </button>
          <figcaption className="mt-xs text-center text-white">
            <span className="font-semibold">{t.name}</span> · <span className="text-white/70">{t.trip}</span>
          </figcaption>
        </figure>
      )}
    </dialog>
  )
}

/** The video card grid: 4 across on wide screens, 3 on lg, 2 on sm, 1 on phones. `count` limits how many show. */
export function VideoGrid({ count }: { count?: number }) {
  const [active, setActive] = useState<Testimonial | null>(null)
  return (
    <div>
      <ul className="grid gap-s sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TESTIMONIALS.slice(0, count).map((t, i) => (
          <VideoCard
            key={t.id}
            t={t}
            i={i}
            autoplay={i === 0}
            onExpand={() => setActive(t)}
            // a limited row (home page) shows only 3 where the grid has 3 columns (lg), so no lone card wraps; hidden cards never load
            className={count !== undefined && i >= 3 ? "lg:max-xl:hidden" : undefined}
          />
        ))}
      </ul>
      <VideoLightbox t={active} onClose={() => setActive(null)} />
    </div>
  )
}

/** Home page section: heading, the first row of videos, and a button to the full page. */
export function VideoTestimonials() {
  return (
    <div className="stack [--stack-gap:var(--space-xl)]">
      {/* cards use the wide container, but the title stays on the normal page width like every other section */}
      <div className="mx-auto w-[min(100%,80rem)]">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Guest videos"
          title="What travellers say."
          description="Short clips from travellers, in their own words."
        />
      </div>

      <VideoGrid count={ROW} />

      {TESTIMONIALS.length > ROW && (
        <div className="flex justify-center">
          <Link href="/testimonial" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
            Load more videos
            <ArrowRightIcon aria-hidden />
          </Link>
        </div>
      )}
    </div>
  )
}
