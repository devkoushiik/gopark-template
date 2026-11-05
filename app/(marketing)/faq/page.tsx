import type { Metadata } from "next"
import { BusIcon, MessageCircleIcon, SquareParkingIcon } from "lucide-react"

import { FaqBrowser } from "@/components/faq/faq-browser"
import { Reveal } from "@/components/home/reveal"
import { InkGrid } from "@/components/layout/ink-grid"
import { NotchTile } from "@/components/layout/notch-tile"
import { FAQS } from "@/lib/faq"

export const metadata: Metadata = {
  title: "FAQ — GoPark",
  description: "Answers about booking, arrival, the shuttle and parking at Rome Fiumicino.",
}

const HELP_ACTIONS = [
  { href: "/contact", Icon: MessageCircleIcon, title: "Contact us", body: "Message the team, we reply fast.", primary: true },
  { href: "/call-shuttle", Icon: BusIcon, title: "Call shuttle", body: "Request a pick-up now." },
  { href: "/booking", Icon: SquareParkingIcon, title: "Book parking", body: "Get your price and reserve a spot." },
]

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* hero (search + topic board) and answers share filter state, so both live in FaqBrowser */}
      <FaqBrowser />

      <section aria-labelledby="faq-cta" className="pb-section">
        <div className="container-fluid [--container:96rem]">
          {/* help desk: copy on the left, three action tiles on the right (contact is the primary one) */}
          <Reveal className="anim-help relative isolate grid gap-l overflow-hidden rounded-card bg-ink p-l text-ink-foreground lg:p-xl xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] xl:items-center">
            <InkGrid />
            <div className="help-copy stack [--stack-gap:var(--space-xs)]">
              <h2 id="faq-cta" className="text-h2 font-semibold">Still have questions?</h2>
              <p className="max-w-[36ch] text-ink-muted">Message our team, or use self-service for the fastest help.</p>
            </div>

            <ul className="grid gap-xs sm:grid-cols-3">
              {HELP_ACTIONS.map(({ href, Icon, title, body, primary }) => (
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
