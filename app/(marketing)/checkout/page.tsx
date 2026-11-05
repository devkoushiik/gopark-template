import type { Metadata } from "next"
import { Suspense } from "react"

import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = {
  title: "Complete your booking | GoPark",
  robots: { index: false },
}

export default function CheckoutPage() {
  return (
    // reads the trip from the URL, so it renders in the browser (static export)
    <Suspense
      fallback={
        <div className="container-fluid py-section">
          <div aria-hidden className="h-96 animate-pulse rounded-card border bg-card" />
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  )
}
