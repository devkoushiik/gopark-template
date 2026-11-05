import Link from "next/link"
import { Suspense } from "react"
import { preload } from "react-dom"
import { BadgeCheckIcon, BusIcon, MapPinIcon } from "lucide-react"

import { BookingSearchForm } from "@/components/home/booking-search-form"
import { HeroVideo } from "@/components/home/hero-video"
import { RouteStrip } from "@/components/home/route-strip"

export function HeroSection() {
  // LCP image: fetch it from the <head>, before the video element is even parsed
  preload("/images/hero-poster.webp", { as: "image", fetchPriority: "high" })
  return (
    <section
      id="book"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-ink text-ink-foreground"
    >
      {/* Background video + dark overlay (ink fallback shows while loading) */}
      <HeroVideo src="/videos/hero.mp4" wideSrc="/videos/hero-hd.mp4" poster="/images/hero-poster.webp" priority className="absolute inset-0 -z-20 size-full object-cover" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(11_15_25/0.75)_0%,rgb(11_15_25/0.5)_45%,rgb(11_15_25/0.25)_100%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink/40 to-transparent" />

      {/* Readability trick: soft tint behind the text column only.
          Busy footage under the copy melts into colour; the rest of the video stays sharp.
          (No backdrop-blur here: blurring a playing video every frame is costly.) */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 -z-10 w-full bg-ink/55 [mask-image:linear-gradient(to_bottom,black_55%,transparent)] lg:w-[62%] lg:[mask-image:linear-gradient(to_right,black_45%,transparent)]"
      />
      {/* switcher: side-by-side once the row is ≥ 56rem, stacked otherwise */}
      <div className="container-fluid switcher items-center py-xl [--switch-at:56rem] min-h-[calc(100vh-var(--header-h))] supports-[height:1svh]:min-h-[calc(100svh-var(--header-h))]">
        <div className="stack [--stack-gap:var(--space-l)] [text-shadow:0_1px_2px_rgb(11_15_25/0.5),0_2px_18px_rgb(11_15_25/0.45)]">
          <div className="stack [--stack-gap:var(--space-s)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <p className="inline-flex w-fit overflow-hidden rounded-full text-sm font-medium ring-1 ring-white/15 [text-shadow:none]">
              <span className="inline-flex items-center gap-1.5 bg-primary py-1.5 pr-3 pl-2.5 text-primary-foreground">
                <BadgeCheckIcon aria-hidden className="size-4" />
                Official car park
              </span>
              <span className="inline-flex items-center gap-1.5 bg-ink/55 py-1.5 pr-3 pl-2.5">
                <MapPinIcon aria-hidden className="size-4" />
                Rome Fiumicino
              </span>
            </p>
            <h1 id="hero-title" className="max-w-[12ch] text-hero font-bold">
              Park in minutes. Fly stress-free.
            </h1>
            <p className="max-w-[38ch] text-white/85">
              Leave the car with us and ride the free shuttle straight to your terminal, day or night.
            </p>
          </div>

          <RouteStrip />

          <div className="flex flex-wrap items-center gap-x-s gap-y-2xs">
            <span className="text-sm font-medium text-white/85">Already parked?</span>
            <Link
              href="/call-shuttle"
              className="group relative inline-flex h-11 items-center overflow-hidden rounded-full bg-white pr-5 pl-11 text-sm font-semibold text-ink shadow-[0_10px_24px_-12px_rgb(0_0_0/0.6)] [text-shadow:none] transition-[padding,background-color,scale] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:bg-brand-soft hover:pr-11 hover:pl-5 focus-visible:pr-11 focus-visible:pl-5 active:scale-[0.97]"
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
          </div>
        </div>

        <div className="flex justify-center text-foreground lg:justify-end">
          {/* Defaults depend on "now" → request-time render. Invisible same-size spacer: no flash before the pass slips in. */}
          <Suspense
            fallback={
              <div aria-hidden className="h-[38rem] w-[min(100%,26rem)]" />
            }
          >
            <BookingSearchForm className="w-[min(100%,26rem)]" />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
