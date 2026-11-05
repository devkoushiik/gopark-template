import { BusIcon, PlaneTakeoffIcon, SquareParkingIcon } from "lucide-react"

/**
 * Car park → terminal route. The shuttle drives across once on load and
 * the road fills behind it; under reduced motion it renders already arrived.
 */
export function RouteStrip() {
  return (
    <figure className="w-full max-w-[30rem]" aria-label="Free shuttle: about 6 minutes from GoPark to Terminals 1 and 3">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-xs">
        <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground">
          <SquareParkingIcon aria-hidden className="size-5" />
        </span>

        {/* road */}
        <div className="relative h-11 overflow-hidden" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.35)_0_8px,transparent_8px_14px)]" />
          <span className="absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-primary motion-safe:animate-route-fill" />
          <span className="absolute inset-0 flex justify-end motion-safe:animate-route-drive">
            <span className="grid size-8 place-items-center self-center rounded-full bg-white text-ink shadow-[0_6px_16px_-6px_rgb(0_0_0/0.6)]">
              <BusIcon className="size-4" />
            </span>
          </span>
        </div>

        <span className="grid size-11 place-items-center overflow-hidden rounded-lg bg-primary ring-1 ring-white/20 motion-safe:animate-terminal-arrive">
          <span className="grid place-items-center motion-safe:animate-plane-takeoff">
            <PlaneTakeoffIcon aria-hidden className="size-5" />
          </span>
        </span>
      </div>

      <figcaption className="mt-2xs grid grid-cols-[1fr_auto_1fr] items-baseline gap-xs text-sm text-white/85">
        <span>GoPark</span>
        <span className="text-center">
          <span className="font-semibold text-ink-foreground tabular">6 min</span> free shuttle
        </span>
        <span className="text-right">Terminals 1 & 3</span>
      </figcaption>
    </figure>
  )
}
