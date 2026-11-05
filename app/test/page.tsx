import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Route index | GoPark",
  robots: { index: false, follow: false },
}

const GROUPS: { title: string; routes: { href: string; label: string }[] }[] = [
  {
    title: "Marketing",
    routes: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Booking flow",
    routes: [
      { href: "/booking", label: "Booking" },
      { href: "/checkout", label: "Checkout" },
      { href: "/call-shuttle", label: "Call shuttle" },
      { href: "/damage-report", label: "Damage report" },
    ],
  },
  {
    title: "Auth",
    routes: [
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Sign up" },
      { href: "/forgot-password", label: "Forgot password" },
      { href: "/reset-password", label: "Reset password" },
      { href: "/verify-email", label: "Verify email" },
      { href: "/verify-code", label: "Verify code" },
    ],
  },
  {
    title: "Other",
    routes: [{ href: "/this-page-does-not-exist", label: "404 / not found" }],
  },
]

export default function TestRoutesPage() {
  return (
    <main className="container-fluid stack py-xl [--stack-gap:var(--space-l)]">
      <header className="stack [--stack-gap:var(--space-2xs)]">
        <h1 className="text-h1 font-semibold tracking-tight">All routes</h1>
        <p className="text-muted-foreground">Manual test index. Not indexed by search engines.</p>
      </header>

      <div className="grid gap-m sm:grid-cols-2 lg:grid-cols-3">
        {GROUPS.map(({ title, routes }) => (
          <section key={title} aria-labelledby={`group-${title}`} className="rounded-2xl border bg-card p-s">
            <h2 id={`group-${title}`} className="mb-xs text-lg font-semibold">
              {title} <span className="text-sm font-normal text-muted-foreground tabular">({routes.length})</span>
            </h2>
            <ul className="divide-y">
              {routes.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center justify-between gap-s py-2xs hover:text-primary">
                    <span className="font-medium">{label}</span>
                    <code className="text-sm text-muted-foreground">{href}</code>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
