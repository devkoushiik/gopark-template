import { BusIcon, CarIcon, CctvIcon, DropletsIcon, UserRoundCheckIcon, WarehouseIcon } from "lucide-react"

import { Reveal } from "@/components/home/reveal"
import { cn } from "@/lib/utils"

// From the operator's services copy, trimmed to 17 words each so the cards balance; verify before launch.
const SERVICES = [
  {
    id: "shuttle",
    Icon: BusIcon,
    note: "Free with every booking",
    title: "Free shuttle 24/7",
    body: "Included with every booking. Runs every 15-20 minutes, 24 hours a day, to Terminals 1 and 3.",
  },
  {
    id: "valet",
    Icon: UserRoundCheckIcon,
    note: "Choose it when booking",
    title: "Car valet",
    body: "Skip the shuttle. Pick Car Valet when booking and hand over your car right at the terminal.",
  },
  {
    id: "covered",
    Icon: WarehouseIcon,
    note: "Covered space for a small fee",
    title: "Outdoor and covered parking",
    body: "An open-air space is included. Upgrade to a covered space for extra protection from sun and rain.",
  },
  {
    id: "wash",
    Icon: DropletsIcon,
    note: "Keeping your keys is free",
    title: "Full wash, and keys with you",
    body: "Add a full car wash and return to a clean car. Want to keep your keys? Free.",
  },
  {
    id: "vehicles",
    Icon: CarIcon,
    note: "Cars free, large vehicles surcharge",
    title: "Every vehicle is welcome",
    body: "Standard cars park at no extra cost. Buses and large vehicles pay a surcharge, shown when booking.",
  },
  {
    id: "security",
    Icon: CctvIcon,
    note: "On site 24/7",
    title: "24/7 security and assistance",
    body: "Video surveillance covers the site, support runs 24/7, and photos of your car are in your dashboard.",
  },
]

// Per card: colour, text tone, icon tile + plate colours, and its place in the fan (xl only).
// Tilt mirrors around the centre and heights alternate, so every overlap reads the same.
const LOOK = [
  { bg: "bg-primary", fg: "text-white", tile: "bg-white text-primary", plate: "bg-white/25", sub: "text-white/80", rot: -6, y: 16 },
  { bg: "bg-[#eef2fa]", fg: "text-ink", tile: "bg-primary text-white", plate: "bg-primary/20", sub: "text-ink/70", rot: 4, y: 36 },
  { bg: "bg-[#4ea8f2]", fg: "text-ink", tile: "bg-ink text-white", plate: "bg-ink/15", sub: "text-ink/75", rot: -3, y: 16 },
  { bg: "bg-[#93b4ff]", fg: "text-ink", tile: "bg-white text-primary", plate: "bg-ink/10", sub: "text-ink/75", rot: 3, y: 36 },
  { bg: "bg-ink", fg: "text-white", tile: "bg-primary text-white", plate: "bg-white/10", sub: "text-white/75", rot: -4, y: 16 },
  { bg: "bg-[#1d3f9e]", fg: "text-white", tile: "bg-white text-[#1d3f9e]", plate: "bg-white/20", sub: "text-white/80", rot: 6, y: 36 },
]

/**
 * Fanned deck of the six services (xl+): overlapping cards, each tilted; hover or focus lifts a card
 * to the front and straightens it. Below xl: plain grid.
 *
 * Scroll animation (.anim-fan in globals.css): the deck starts as one stack in the middle and spreads
 * into the fan; below xl the cards rise in one by one.
 */
export function ServicesFan() {
  return (
    <Reveal plain className="anim-fan">
    <ul className="isolate mt-xl grid gap-s sm:grid-cols-2 lg:grid-cols-3 xl:relative xl:block xl:h-[29rem] 2xl:h-[34rem]">
      {SERVICES.map(({ id, Icon, title, body, note }, i) => {
        const look = LOOK[i]
        return (
          <li
            key={id}
            id={id}
            tabIndex={0}
            style={{ "--i": i, "--rot": `${look.rot}deg`, "--y": `${look.y}px` } as React.CSSProperties}
            className={cn(
              "group relative flex scroll-mt-[calc(var(--header-h)+var(--space-xl))] flex-col overflow-hidden rounded-2xl shadow-[0_20px_40px_-18px_rgb(11_15_25/0.5)] outline-none focus-visible:ring-4 focus-visible:ring-primary/40",
              look.bg,
              look.fg,
              // fan placement from xl: spread across the row, tilted, staggered heights
              "xl:absolute xl:top-0 xl:h-[23rem] 2xl:h-[26.5rem] xl:w-[min(23rem,21%)] xl:[left:calc(var(--i)*(100%-min(23rem,21%))/5)] xl:[transform:translateY(var(--y))_rotate(var(--rot))] xl:transition-[transform,box-shadow] xl:duration-500 xl:ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              "xl:hover:z-50 xl:hover:[transform:translateY(-1rem)_rotate(0deg)_scale(1.04)] xl:focus-visible:z-50 xl:focus-visible:[transform:translateY(-1rem)_rotate(0deg)_scale(1.04)]",
            )}
          >
            {/* three groups (icon / title + description / note), spaced evenly down the card */}
            <span className="flex flex-1 flex-col justify-between gap-s p-m">
              {/* sticker icon: tinted plate behind, tilted tile with a 3D bottom edge */}
              <span aria-hidden className="relative size-14 shrink-0">
                <span className={cn("absolute inset-0 rotate-[8deg] rounded-2xl transition-transform duration-500 group-hover:rotate-[14deg]", look.plate)} />
                <span
                  className={cn(
                    "relative grid size-14 -rotate-[4deg] place-items-center rounded-2xl shadow-[inset_0_-4px_0_rgb(0_0_0/0.15)] transition-transform duration-500 group-hover:rotate-0",
                    look.tile,
                  )}
                >
                  <Icon className="size-6" strokeWidth={2} />
                </span>
              </span>
              <span className="stack [--stack-gap:var(--space-s)]">
                <strong className="text-h3 leading-tight font-semibold">{title}</strong>
                <span className={cn("text-sm", look.sub)}>{body}</span>
              </span>
              <span className={cn("text-sm font-semibold", look.sub)}>{note}</span>
            </span>
          </li>
        )
      })}
    </ul>
    </Reveal>
  )
}
