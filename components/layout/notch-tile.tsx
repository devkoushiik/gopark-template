import Link from "next/link"
import { ArrowUpRightIcon, type LucideIcon } from "lucide-react"

/**
 * Help tile with its top-right corner notched out; the arrow sits in the notch as its own
 * small button. The notch and its two inverted corners are painted in the panel colour (ink),
 * so the tile edge appears to curve around the button.
 */
export function NotchTile({
  href,
  Icon,
  title,
  body,
  primary,
}: {
  href: string
  Icon: LucideIcon
  title: string
  body: string
  primary?: boolean
}) {
  const tile = primary ? "bg-primary group-hover:bg-primary-hover" : "bg-[#252e45] group-hover:bg-[#2d3752]"
  // inverted corner: ink everywhere except a quarter circle at its bottom-left, where the tile shows
  const corner = "absolute size-4 bg-[radial-gradient(circle_at_0_100%,transparent_1rem,var(--ink)_1rem)]"
  return (
    <Link href={href} className="group relative flex h-full min-h-68 flex-col justify-end gap-l transition-transform duration-300 hover:-translate-y-0.5">
      <span aria-hidden className={"absolute inset-0 rounded-2xl transition-colors " + tile} />
      {/* mesh background: soft colour blobs + a faint diagonal lattice fading toward the text */}
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <span
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: primary
              ? "radial-gradient(60% 55% at 15% 10%, rgb(147 180 255 / 0.3), transparent 70%), radial-gradient(55% 50% at 85% 60%, rgb(29 63 158 / 0.85), transparent 70%), radial-gradient(50% 45% at 30% 95%, rgb(78 168 242 / 0.25), transparent 70%)"
              : "radial-gradient(60% 55% at 15% 10%, rgb(37 99 235 / 0.22), transparent 70%), radial-gradient(55% 50% at 85% 60%, rgb(78 168 242 / 0.1), transparent 70%), radial-gradient(50% 45% at 30% 95%, rgb(29 63 158 / 0.25), transparent 70%)",
          }}
        />
        <span
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black,black_35%,transparent_80%)]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(30deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 18px), repeating-linear-gradient(150deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 18px)",
          }}
        />
      </span>
      {/* notch + its two inverted corners */}
      <span aria-hidden className="absolute top-0 right-0 size-14 rounded-bl-2xl bg-ink" />
      <span aria-hidden className={corner + " top-0 right-14"} />
      <span aria-hidden className={corner + " top-14 right-0"} />
      {/* arrow button inside the notch */}
      <span aria-hidden className={"notch-arrow absolute top-0 right-0 grid size-12 place-items-center rounded-xl transition-colors " + tile}>
        <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>

      <span className="relative stack p-s pt-0 [--stack-gap:var(--space-3xs)]">
        {/* icon badge sits right above the title */}
        <span className={"mb-xs grid size-10 place-items-center rounded-xl " + (primary ? "bg-white/15" : "bg-white/10 text-[#93b4ff]")}>
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="font-semibold">{title}</span>
        {/* reserve two lines when tiles sit in a row, so icons and titles line up whatever the copy length */}
        <span className={"text-sm sm:min-h-[3em] " + (primary ? "text-white/80" : "text-ink-muted")}>{body}</span>
      </span>
    </Link>
  )
}
