export type NavItem = { label: string; href: string }

// Header: short list so it stays on one line at lg (1024px).
export const HEADER_NAV: NavItem[] = [
  { label: "Book parking", href: "/booking" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/testimonial" }, // short label: the bar must stay on one line at 1024px
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

// Self-serve shortcuts for travellers already booked (spec §3).
export const UTILITY_NAV: NavItem[] = [
  { label: "Call shuttle", href: "/call-shuttle" },
  { label: "Book parking", href: "/booking" },
]

// Footer + full list. Only link to implemented routes/anchors (spec §3 Header).
export const PRIMARY_NAV: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Arrival guide", href: "/#arrival" },
  { label: "Reviews", href: "/testimonial" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

// Single operated location → may be preselected (spec §4).
export const AIRPORTS = [{ value: "fco", label: "Rome Fiumicino (FCO) — Terminals 1 & 3" }]

export const TIME_STEP_MINUTES = 30

// From the operator's previous site — confirm before launch.
export const CONTACT = {
  phones: ["333 430 7363", "333 430 7358"],
  email: "supporto@aeroparkfiumicino.com",
  address: ["Via Aldo Quarantotti, 50", "Fiumicino, Italy"],
}
