import Image from "next/image"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { HeroVideo } from "@/components/home/hero-video"
import { Logo } from "@/components/layout/logo"

type Media = { type: "video"; src: string; hdSrc?: string } | { type: "image"; src: string; alt: string }

/**
 * Two-column auth layout: full-bleed media with a caption on the left (lg+),
 * the form on the right. On smaller screens only the form column shows.
 */
export function AuthShell({
  media,
  caption,
  captionBody,
  title,
  description,
  children,
  footer,
}: {
  media: Media
  caption: string
  captionBody: string
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* media column */}
      <aside className="relative isolate hidden overflow-hidden bg-ink text-white lg:block">
        {media.type === "video" ? (
          <HeroVideo src={media.src} hdSrc={media.hdSrc} className="absolute inset-0 -z-20 size-full object-cover" />
        ) : (
          <Image src={media.src} alt={media.alt} fill priority sizes="50vw" className="-z-20 object-cover" />
        )}
        {/* dark overlay over the whole video, deeper at the top and bottom where the logo and caption sit */}
        <span
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(11_15_25/0.7),rgb(11_15_25/0.45)_35%,rgb(11_15_25/0.45)_55%,rgb(11_15_25/0.9))]"
        />
        <div className="flex h-full flex-col justify-between p-xl">
          <Logo tone="light" />
          <div className="stack max-w-[30rem] [--stack-gap:var(--space-xs)]">
            <p className="text-h2 leading-tight font-semibold text-balance">{caption}</p>
            <p className="text-white/80">{captionBody}</p>
          </div>
        </div>
      </aside>

      {/* form column */}
      <main id="main" className="flex flex-col px-gutter py-l lg:px-xl">
        <div className="flex items-center justify-between gap-s">
          <span className="lg:hidden">
            <Logo size="sm" />
          </span>
          <Link
            href="/"
            className="ml-auto inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon aria-hidden className="size-4" /> Back to site
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-[26rem] flex-1 flex-col justify-center py-xl">
          <div className="stack [--stack-gap:var(--space-xs)]">
            <h1 className="text-h2 font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
          <div className="mt-l">{children}</div>
          {footer && <p className="mt-l text-center text-sm text-muted-foreground">{footer}</p>}
        </div>
      </main>
    </div>
  )
}
