import { HeroSection } from "@/components/home/hero-section"
import { ParkingTapes } from "@/components/home/parking-tapes"
import {
  AppSection,
  ArrivalGuide,
  CancellationPolicy,
  FaqPreview,
  FinalCta,
  HowItWorks,
  ServiceGrid,
  StatsStrip,
  Testimonials,
} from "@/components/home/home-sections"

export default function HomePage() {
  return (
    <>
      {/* Shutter: the board is pinned to the viewport bottom behind the hero;
          scrolling lifts the hero and uncovers it, then the page flows on. */}
      <div className="relative">
        <div className="relative z-10 shadow-[0_30px_60px_-24px_rgb(11_15_25/0.6)]">
          <HeroSection />
        </div>
        <div id="shutter-edge" aria-hidden className="h-px -mt-px" />
        {/* Tall pinned panel = long, gradual reveal before the page scrolls on */}
        <div className="sticky bottom-0 z-0">
          <StatsStrip startOn="shutter-edge" className="flex min-h-[28svh] flex-col justify-center" />
        </div>
      </div>
      <HowItWorks />
      <ServiceGrid />
      <ArrivalGuide />
      <CancellationPolicy />
      <ParkingTapes className="bg-secondary" />
      <AppSection />
      <Testimonials />
      <FaqPreview />
      <FinalCta />
    </>
  )
}
