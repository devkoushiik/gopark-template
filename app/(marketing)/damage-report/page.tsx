import type { Metadata } from "next"
import { CarFrontIcon } from "lucide-react"

import { DamageReport } from "@/components/damage/damage-report"
import { DotPattern } from "@/components/layout/dot-pattern"

export const metadata: Metadata = {
  title: "Report vehicle damage | GoPark",
  description: "Found damage to your car after parking with GoPark? Send us the details and photos and our team will review your claim.",
}

export default function DamageReportPage() {
  return (
    <>
      {/* same look as the contact / booking / shuttle heroes */}
      <section aria-labelledby="damage-title" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <DotPattern />
        <div aria-hidden className="edge-arc top-[8%] -left-48 size-[26rem] [--arc-start:200deg] max-md:hidden" />
        <div
          aria-hidden
          className="edge-arc -right-40 bottom-[6%] size-[24rem] [--arc-start:20deg] [--arc-dur:34s] [--arc-dir:reverse] max-md:hidden"
        />
        <div className="container-fluid stack py-xl [--stack-gap:var(--space-s)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-3 pl-2.5 text-sm font-medium ring-1 ring-white/15 backdrop-blur-md">
            <CarFrontIcon aria-hidden className="size-4" />
            Damage report
          </p>
          <h1 id="damage-title" className="max-w-[14ch] text-hero font-bold">Report vehicle damage.</h1>
          <p className="max-w-[48ch] text-lg text-white/80">
            Found damage to your car? Send us the details and photos and our team will review your claim.
          </p>
        </div>
      </section>

      <div className="container-fluid py-xl">
        <DamageReport />
      </div>
    </>
  )
}
