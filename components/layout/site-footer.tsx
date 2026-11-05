import Link from "next/link"
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

import { FooterWordmark } from "@/components/layout/footer-wordmark"
import { NewsletterForm } from "@/components/layout/newsletter-form"
import { NewsletterReveal } from "@/components/layout/newsletter-reveal"
import { Logo } from "@/components/layout/logo"
import { CONTACT, PRIMARY_NAV } from "@/lib/constants"
import { FOOTER } from "@/lib/content"

// hover: a brand-blue underline sweeps in under the label and an arrow pops up beside it
const linkClass =
  "inline-flex min-h-10 items-center text-sm text-white/65 transition-[color,background-size] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-[linear-gradient(var(--primary),var(--primary))] bg-no-repeat bg-[length:0%_2px] bg-[position:0_calc(50%+0.75em)] after:ml-1.5 after:translate-y-1 after:text-base after:leading-none after:text-primary after:opacity-0 after:transition-all after:duration-300 after:content-['↗'] hover:text-white hover:bg-[length:100%_2px] hover:after:translate-y-0 hover:after:opacity-100 focus-visible:text-white focus-visible:bg-[length:100%_2px] focus-visible:after:translate-y-0 focus-visible:after:opacity-100"

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-xs">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        {icon}
      </span>
      <span className="min-w-0 text-sm leading-snug">{children}</span>
    </span>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative isolate bg-black text-primary-foreground">
      <div className="relative z-10 isolate overflow-hidden rounded-b-[2rem] bg-neutral-950 ring-1 ring-white/10">

      <div className="container-fluid pt-xl">
        {/* Newsletter band */}
        <NewsletterReveal title={FOOTER.newsletter.title} body={FOOTER.newsletter.body}>
          <NewsletterForm inline />
        </NewsletterReveal>

        {/* Main */}
        <div className="grid gap-l py-xl md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,1.3fr)]">
          <div className="stack [--stack-gap:var(--space-s)]">
            <Logo tone="light" />
            <p className="max-w-[38ch] text-sm text-white/65">{FOOTER.about}</p>
            <p className="max-w-[38ch] text-sm text-white/50">
              <span className="font-semibold text-white/65">Agreements. </span>
              {FOOTER.agreements}
            </p>
          </div>

          <nav aria-labelledby="f-explore" className="stack [--stack-gap:var(--space-xs)]">
            <h2 id="f-explore" className="text-sm font-semibold text-primary-foreground">Explore</h2>
            <ul>
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="stack [--stack-gap:var(--space-xs)]">
            <h2 className="text-sm font-semibold text-primary-foreground">Services</h2>
            <ul>
              {FOOTER.services.map((s) => (
                <li key={s}>
                  <Link href="/services" className={linkClass}>{s}</Link>
                </li>
              ))}
              <li>
                <Link href="/damage-report" className={linkClass}>Report vehicle damage</Link>
              </li>
            </ul>
          </div>

          <address className="stack not-italic [--stack-gap:var(--space-xs)]">
            <h2 className="text-sm font-semibold text-primary-foreground">Contact</h2>
            <ul className="grid gap-xs text-sm text-white/65">
              {CONTACT.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:+39${p.replace(/\s/g, "")}`} className="text-sm tabular text-white/65 transition-colors hover:text-primary-foreground hover:underline underline-offset-4">
                    <ContactRow icon={<PhoneIcon aria-hidden className="size-4" />}>{p}</ContactRow>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${CONTACT.email}`} className="text-sm break-words text-white/65 transition-colors hover:text-primary-foreground hover:underline underline-offset-4">
                  <ContactRow icon={<MailIcon aria-hidden className="size-4" />}>{CONTACT.email}</ContactRow>
                </a>
              </li>
              <li>
                <ContactRow icon={<MapPinIcon aria-hidden className="size-4" />}>{CONTACT.address.join(", ")}</ContactRow>
              </li>
            </ul>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-fluid flex flex-wrap items-center justify-between gap-xs py-s text-sm text-white/55">
          <p>© GoPark. All rights reserved.</p>
          {/* TODO: link once /terms, /privacy exist */}
          <p className="flex gap-s">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </p>
        </div>
      </div>
      </div>

      <FooterWordmark />
    </footer>
  )
}
